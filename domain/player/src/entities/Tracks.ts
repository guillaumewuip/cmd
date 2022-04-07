import * as ReadonlyNonEmptyArrayFP from "fp-ts/ReadonlyNonEmptyArray";
import * as ReadonlyArrayFP from "fp-ts/ReadonlyArray";
import * as Option from "fp-ts/Option";
import * as Ord from "fp-ts/Ord";
import * as NumberFP from "fp-ts/number";
import { pipe } from "fp-ts/function";

import * as Track from "./Track";

export type Empty = {
  type: "Empty";
  autoplayEnabled: boolean;
};

export type Loaded = {
  type: "Loaded";
  autoplayEnabled: boolean;
  selected: string;
  alreadyPlayed: boolean;
  allTracks: ReadonlyNonEmptyArrayFP.ReadonlyNonEmptyArray<{
    track: Track.Track;
    weight: number;
  }>;
};

export type Tracks = Empty | Loaded;

export function isEmpty(track: Tracks): track is Empty {
  return track.type === "Empty";
}

export const create = ({
  autoplayEnabled,
}: {
  autoplayEnabled: boolean;
}): Empty => ({
  type: "Empty",
  autoplayEnabled,
});

const toLoaded =
  (track: Track.Track, weight: number) =>
  (tracks: Empty): Loaded => ({
    ...tracks,
    type: "Loaded",
    selected: track.id,
    alreadyPlayed: false,
    allTracks: [{ track, weight }],
  });

const findSelected = (tracks: Loaded): Option.Option<Track.Track> =>
  pipe(
    tracks.allTracks,
    ReadonlyArrayFP.findFirst(({ track }) => track.id === tracks.selected),
    Option.map(({ track }) => track)
  );

export const isSelected =
  (id: string) =>
  (tracks: Tracks): boolean => {
    if (tracks.type === "Empty") {
      return false;
    }

    return pipe(
      tracks,
      findSelected,
      Option.chain(
        Option.fromPredicate((localSelected) => localSelected.id === id)
      ),
      Option.fold(
        () => false,
        () => true
      )
    );
  };

const findTrackIndex =
  (track: Track.Track) =>
  (tracks: Loaded): Option.Option<number> =>
    pipe(
      tracks.allTracks,
      ReadonlyArrayFP.findIndex(
        ({ track: localTrack }) => localTrack.id === track.id
      )
    );

export const findTrackById =
  (id: string) =>
  (tracks: Tracks): Option.Option<Track.Track> => {
    if (tracks.type === "Empty") {
      return Option.none;
    }

    return pipe(
      tracks.allTracks,
      ReadonlyArrayFP.findFirst(({ track }) => track.id === id),
      Option.map(({ track }) => track)
    );
  };

const trackWithWeightOrd = pipe(
  NumberFP.Ord,
  Ord.contramap(({ weight }: { track: Track.Track; weight: number }) => weight)
);

export const addTrack = (track: Track.Track, weight: number) => {
  return (tracks: Tracks): Loaded => {
    if (tracks.type === "Empty") {
      return toLoaded(track, weight)(tracks);
    }

    // add track and sort
    const loadedTracks = {
      ...tracks,
      allTracks: pipe(
        tracks.allTracks,
        ReadonlyArrayFP.append({ track, weight }),
        ReadonlyNonEmptyArrayFP.sort(trackWithWeightOrd)
      ),
    };

    // then update selected

    const { track: firstTrack } = pipe(
      loadedTracks.allTracks,
      ReadonlyNonEmptyArrayFP.head
    );

    return {
      ...loadedTracks,
      selected: firstTrack.id,
    };
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
  const currentAllTracks = tracks.allTracks;

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
      tracks.allTracks,
      ReadonlyArrayFP.findFirst(
        ({ track: localTrack }) => localTrack.id === track.id
      ),
      Option.fold(
        () => tracks, // do nothing
        ({ track: localSelectedTrack }) => ({
          ...tracks,
          selected: localSelectedTrack.id,
        })
      )
    );
  };

export const modifyIfNotEmpty =
  (modifier: (tracks: Loaded) => Loaded) =>
  (tracks: Tracks): Tracks => {
    if (tracks.type === "Empty") {
      return tracks;
    }

    return modifier(tracks);
  };

export const modifyTrack =
  (trackId: string, modifier: (track: Track.Track) => Track.Track) =>
  (tracks: Loaded): Loaded => {
    return pipe(
      tracks,
      findTrackById(trackId),
      Option.chain((track) => findTrackIndex(track)(tracks)),
      Option.map((index) => ({
        ...tracks,
        allTracks: pipe(
          tracks.allTracks,
          ReadonlyNonEmptyArrayFP.modifyAt(index, (trackWithWeight) => ({
            ...trackWithWeight,
            track: modifier(trackWithWeight.track),
          })),
          Option.getOrElse(() => tracks.allTracks)
        ),
      })),
      Option.getOrElse(() => tracks)
    );
  };
