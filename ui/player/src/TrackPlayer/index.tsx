import { useLayoutEffect, useEffect, useRef, useState } from "react";

import * as Eq from "fp-ts/Eq";
import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import {
  register,
  loadBandcamp,
  loadSoundcloud,
  loadYoutube,
  usePlayer,
  shallowEqual,
  Tracks,
  Track,
  Source,
  EmbedableLink,
} from "@cmd/domain-player";

import { VisuallyAndAriaHidden } from "../components/Hidden";

import Aborted from "./Aborted";
import TrackBar from "./TrackBar";

import { previousTitle } from "./previousTitle";
import { position } from "./position";

const eqOptionTrack = pipe(shallowEqual, Eq.fromEquals, Option.getEq);

function Bandcamp({
  track,
  selected,
}: {
  track: Track.NonAborted & { source: Source.Bandcamp };
  selected: boolean;
}) {
  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    loadBandcamp({
      track,
    })();
  }, [track]);

  return <TrackBar track={track} selected={selected} />;
}

function Youtube({
  track,
  selected,
}: {
  track: Track.NonAborted & { source: Source.Youtube };
  selected: boolean;
}) {
  const ref = track.source.container;

  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    loadYoutube({
      track,
    })();
  }, [track]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={ref} tabIndex={-1} />
      </VisuallyAndAriaHidden>

      <TrackBar track={track} selected={selected} />
    </>
  );
}

function Soundcloud({
  track,
  selected,
}: {
  track: Track.NonAborted & { source: Source.Soundcloud };
  selected: boolean;
}) {
  const ref = track.source.container;

  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    loadSoundcloud({
      track,
    })();
  }, [track]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={ref} tabIndex={-1} />
      </VisuallyAndAriaHidden>

      <TrackBar track={track} selected={selected} />
    </>
  );
}

function ClientTrackPlayer({ id }: { id: string }) {
  const maybeTrack = usePlayer(Tracks.findTrackById(id), eqOptionTrack.equals);
  const selected = usePlayer(Tracks.isSelected(id));

  if (Option.isNone(maybeTrack)) {
    return null;
  }

  const track = maybeTrack.value;

  return Track.isAborted(track) ? (
    <Aborted />
  ) : (
    pipe(
      track,
      Track.foldOnSource({
        // eslint-disable-next-line react/no-unstable-nested-components
        Youtube: (localTrack) => (
          <Youtube track={localTrack} selected={selected} />
        ),
        // eslint-disable-next-line react/no-unstable-nested-components
        Soundcloud: (localTrack) => (
          <Soundcloud track={localTrack} selected={selected} />
        ),
        // eslint-disable-next-line react/no-unstable-nested-components
        Bandcamp: (localTrack) => (
          <Bandcamp track={localTrack} selected={selected} />
        ),
      })
    )
  );
}

function TrackPlayerAntiCorruptionLayer({
  embedableLink,
}: {
  embedableLink: EmbedableLink.EmbedableLink;
}) {
  const container = useRef(null);

  const [id, setId] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!container.current) {
      throw new Error(`Container is not mounted`);
    }

    const title = previousTitle(container.current);
    const weight = position(container.current);

    if (Option.isNone(title)) {
      throw new Error(`Can't find title for track`);
    }

    const track = Track.create({
      title: title.value,
      embedableLink,
    });

    register({
      track,
      weight,
    })();

    setId(track.id);
  }, [container, embedableLink, setId]);

  return <div ref={container}>{id && <ClientTrackPlayer id={id} />}</div>;
}

export function TrackPlayer({
  embedableLink,
}: {
  embedableLink: EmbedableLink.EmbedableLink;
}) {
  const [shouldShowChildren, showChildren] = useState(false);

  useEffect(() => {
    showChildren(true);

    return () => {
      showChildren(false);
    };
  }, [showChildren]);

  return shouldShowChildren ? (
    <TrackPlayerAntiCorruptionLayer embedableLink={embedableLink} />
  ) : null;
}
