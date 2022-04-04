import * as Union from "@fp51/opaque-union";

import * as ReadonlyNonEmptyArrayFP from "fp-ts/ReadonlyNonEmptyArray";
import * as ReadonlyArrayFP from "fp-ts/ReadonlyArray";
import * as Option from "fp-ts/Option";
import * as Ord from "fp-ts/Ord";
import * as NumberFP from "fp-ts/number";
import { identity, pipe } from "fp-ts/function";

import * as Track from "./Track";
import * as Volume from "./Volume";

type $Empty = {
  volume: Volume.Volume;
  autoplayEnabled: boolean;
};

type $Loaded = $Empty & {
  selected: string;
  alreadyPlayed: boolean;
  allTracks: ReadonlyNonEmptyArrayFP.ReadonlyNonEmptyArray<{
    track: Track.Track;
    weight: number;
  }>;
};

const TracksAPI = Union.of({
  Empty: Union.type<$Empty>(),
  Loaded: Union.type<$Loaded>(),
});

export type Tracks = Union.Type<typeof TracksAPI>;
export type Empty = ReturnType<typeof TracksAPI.of.Empty>;
export type Loaded = ReturnType<typeof TracksAPI.of.Loaded>;

export const volume = TracksAPI.lensFromProp("volume").get;
export const setVolume = TracksAPI.lensFromProp("volume").set;
export const autoplayEnabled = TracksAPI.lensFromProp("autoplayEnabled").get;
export const setAutoplay = TracksAPI.lensFromProp("autoplayEnabled").set;

export const isEmpty = TracksAPI.is.Empty;

export const { fold } = TracksAPI;

export const create = (data: { autoplayEnabled: boolean; volume: number }) =>
  TracksAPI.of.Empty({
    volume: Volume.create(data.volume),
    autoplayEnabled: data.autoplayEnabled,
  });

const toLoaded = (track: Track.Track, weight: number) => (tracks: Empty) =>
  TracksAPI.of.Loaded({
    volume: volume(tracks),
    autoplayEnabled: autoplayEnabled(tracks),
    selected: Track.id(track),
    alreadyPlayed: false,
    allTracks: [{ track, weight }],
  });

const selected = TracksAPI.Loaded.lensFromProp("selected").get;
const allTracks = TracksAPI.Loaded.lensFromProp("allTracks").get;

export const alreadyPlayed = TracksAPI.Loaded.lensFromProp("alreadyPlayed").get;
export const playing = TracksAPI.Loaded.lensFromProp("alreadyPlayed").set(true);

const findSelected = (tracks: Loaded): Option.Option<Track.Track> =>
  pipe(
    tracks,
    allTracks,
    ReadonlyArrayFP.findFirst(
      ({ track }) => Track.id(track) === selected(tracks)
    ),
    Option.map(({ track }) => track)
  );

export const isSelected = (id: string) => (tracks: Tracks) =>
  pipe(
    tracks,
    Option.of,
    Option.chain(
      fold({
        Empty: () => Option.none,
        Loaded: Option.some,
      })
    ),
    Option.chain(findSelected),
    Option.chain(
      Option.fromPredicate((localSelected) => Track.id(localSelected) === id)
    ),
    Option.fold(
      () => false,
      () => true
    )
  );

const findTrackIndex =
  (track: Track.Track) =>
  (tracks: Loaded): Option.Option<number> =>
    pipe(
      tracks,
      allTracks,
      ReadonlyArrayFP.findIndex(
        ({ track: localTrack }) => Track.id(localTrack) === Track.id(track)
      )
    );

export const findTrackById =
  (id: string) =>
  (tracks: Tracks): Option.Option<Track.Track> =>
    pipe(
      tracks,
      Option.of,
      Option.chain(
        fold({
          Empty: () => Option.none,
          Loaded: Option.some,
        })
      ),
      Option.chain((localTracks) =>
        pipe(
          localTracks,
          allTracks,
          ReadonlyArrayFP.findFirst(({ track }) => Track.id(track) === id)
        )
      ),
      Option.map(({ track }) => track)
    );

const trackWithWeightOrd = pipe(
  NumberFP.Ord,
  Ord.contramap(({ weight }: { track: Track.Track; weight: number }) => weight)
);

export const addTrack = (track: Track.Track, weight: number) => {
  return (tracks: Tracks): Loaded => {
    if (TracksAPI.is.Empty(tracks)) {
      return toLoaded(track, weight)(tracks);
    }

    // add track and sort
    const loadedTracks = pipe(
      tracks,
      TracksAPI.Loaded.lensFromProp("allTracks").modify((localTracks) =>
        pipe(
          localTracks,
          ReadonlyArrayFP.append({ track, weight }),
          ReadonlyNonEmptyArrayFP.sort(trackWithWeightOrd)
        )
      )
    );

    // then update selected

    const { track: firstTrack } = pipe(
      loadedTracks,
      allTracks,
      ReadonlyNonEmptyArrayFP.head
    );

    return pipe(
      loadedTracks,
      TracksAPI.Loaded.lensFromProp("selected").set(Track.id(firstTrack))
    );
  };
};

export const selectedTrack = (tracks: Loaded): Track.Track => {
  const localSelected = pipe(tracks, findSelected);

  if (Option.isNone(localSelected)) {
    throw new Error("Can't find selected track");
  }

  return localSelected.value;
};

export const nextTrack = (tracks: Loaded): Option.Option<Track.Track> => {
  const currentAllTracks = allTracks(tracks);

  const currentSelectedTrackIndex = pipe(
    tracks,
    findTrackIndex(selectedTrack(tracks))
  );

  if (Option.isNone(currentSelectedTrackIndex)) {
    throw new Error("Can't get selected track index");
  }

  if (currentSelectedTrackIndex.value < currentAllTracks.length - 1) {
    const nextIndex = currentSelectedTrackIndex.value + 1;
    return Option.some(currentAllTracks[nextIndex].track);
  }

  return Option.none;
};

export const selectTrack =
  (track: Track.Track) =>
  (tracks: Loaded): Loaded => {
    return pipe(
      tracks,
      allTracks,
      ReadonlyArrayFP.findFirst(({ track: localTrack }) =>
        Track.eqId.equals(localTrack, track)
      ),
      Option.fold(
        () => tracks, // do nothing
        (localSelectedTrack) =>
          pipe(
            tracks,
            TracksAPI.Loaded.lensFromProp("selected").set(
              Track.id(localSelectedTrack.track)
            )
          )
      )
    );
  };

export const modifyIfNotEmpty = (modifier: (track: Loaded) => Loaded) =>
  TracksAPI.fold<Tracks>({
    Empty: identity,
    Loaded: modifier,
  });

export const modifyTrack =
  (trackId: string, modifier: (track: Track.Track) => Track.Track) =>
  (tracks: Loaded): Loaded => {
    const trackIndex = pipe(
      tracks,
      findTrackById(trackId),
      Option.chain((track) => findTrackIndex(track)(tracks))
    );

    return pipe(
      trackIndex,
      Option.map((index) =>
        TracksAPI.Loaded.lensFromProp("allTracks").modify((localTracks) =>
          pipe(
            localTracks,
            ReadonlyNonEmptyArrayFP.modifyAt(index, (trackWithWeight) => ({
              ...trackWithWeight,
              track: modifier(trackWithWeight.track),
            })),
            Option.getOrElse(() => localTracks)
          )
        )(tracks)
      ),
      Option.getOrElse(() => tracks)
    );
  };
