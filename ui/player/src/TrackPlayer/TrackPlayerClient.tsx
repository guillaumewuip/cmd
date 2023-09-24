"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import * as Option from "fp-ts/Option";

import {
  register,
  loadSoundcloud,
  loadYoutube,
  loadBandcamp,
  Track,
  Source,
  EmbedableLink,
} from "@cmd/domain-player";

import { previousTitle } from "./previousTitle";
import { position } from "./position";
import TrackBar from "./TrackBar";

import { VisuallyAndAriaHidden } from "../components/Hidden";

import { Skeleton } from "./Skeleton";

function useTrack<S extends Source.Source>({
  embedableLink,
  source,
}: {
  embedableLink: EmbedableLink.EmbedableLink;
  source: () => S;
}): {
  container: React.RefObject<HTMLDivElement>;
  track: (Track.Reserved & { source: S }) | null;
} {
  const container = useRef<HTMLDivElement>(null);

  const [track, setTrack] = useState<(Track.Reserved & { source: S }) | null>(
    null
  );

  useLayoutEffect(() => {
    if (!container.current) {
      throw new Error(`Container is not mounted`);
    }

    const id = EmbedableLink.slugify(embedableLink);
    const title = previousTitle(container.current);
    const weight = position(container.current);

    if (Option.isNone(title)) {
      throw new Error(`title not found for track at position ${weight}`);
    }

    const localTrack = Track.create({
      id,
      title: title.value,
      source: source(),
    });

    register({ track: localTrack, weight })();

    setTrack(localTrack);
  }, [embedableLink, source]);

  return {
    container,
    track,
  };
}

function SoundCloudTrackBar({
  track,
}: {
  track: Track.Track & { source: Source.Soundcloud };
}) {
  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={track.source.container} tabIndex={-1} />
      </VisuallyAndAriaHidden>
      <TrackBar id={track.id} />
    </>
  );
}

export function SoundcloudClient({
  embedableLink,
  soundcloudId,
  thumbnail,
}: {
  embedableLink: EmbedableLink.Soundcloud;
  soundcloudId: string;
  thumbnail: string;
}) {
  const createSource = useCallback(
    () =>
      Source.createSoundcloud({
        embedableLink,
        soundcloudId,
        thumbnail,
      }),
    [embedableLink, soundcloudId, thumbnail]
  );

  const { container, track } = useTrack({
    embedableLink,
    source: createSource,
  });

  useEffect(() => {
    if (!track) {
      return;
    }

    if (!Track.isReserved(track)) {
      return;
    }

    loadSoundcloud({
      track,
    })();
  }, [track]);

  return (
    <div ref={container}>
      {track ? <SoundCloudTrackBar track={track} /> : <Skeleton />}
    </div>
  );
}

function YoutubeTrackBar({
  track,
}: {
  track: Track.Track & { source: Source.Youtube };
}) {
  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={track.source.container} tabIndex={-1} />
      </VisuallyAndAriaHidden>
      <TrackBar id={track.id} />
    </>
  );
}

export function YoutubeClient({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Youtube;
}) {
  const createSource = useCallback(
    () =>
      Source.createYoutube({
        embedableLink,
      }),
    [embedableLink]
  );

  const { container, track } = useTrack({
    embedableLink,
    source: createSource,
  });

  useEffect(() => {
    if (!track) {
      return;
    }

    if (!Track.isReserved(track)) {
      return;
    }

    loadYoutube({
      track,
    })();
  }, [track]);

  return (
    <div ref={container}>
      {track ? <YoutubeTrackBar track={track} /> : <Skeleton />}
    </div>
  );
}

export function BandcampClient({
  embedableLink,
  streamUrl,
  thumbnail,
}: {
  embedableLink: EmbedableLink.Bandcamp;
  streamUrl: string;
  thumbnail: string;
}) {
  const createSource = useCallback(
    () =>
      Source.createBandcamp({
        embedableLink,
        streamUrl,
        thumbnail,
      }),
    [embedableLink, streamUrl, thumbnail]
  );

  const { container, track } = useTrack({
    embedableLink,
    source: createSource,
  });

  useEffect(() => {
    if (!track) {
      return;
    }

    if (!Track.isReserved(track)) {
      return;
    }

    loadBandcamp({
      track,
    })();
  }, [track]);

  return (
    <div ref={container}>
      {track ? <TrackBar id={track.id} /> : <Skeleton />}
    </div>
  );
}
