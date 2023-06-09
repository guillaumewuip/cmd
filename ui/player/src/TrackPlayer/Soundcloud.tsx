"use client";

import { useEffect, useMemo } from "react";

import {
  register,
  loadSoundcloud,
  Track,
  Source,
  EmbedableLink,
} from "@cmd/domain-player";

import TrackBar from "./TrackBar";

import { VisuallyAndAriaHidden } from "../components/Hidden";

export function SoundcloudClient({
  embedableLink,
  soundcloudId,
  thumbnail,
  title,
  weight,
}: {
  embedableLink: EmbedableLink.Soundcloud;
  soundcloudId: string;
  thumbnail: string;
  title: string;
  weight: number;
}) {
  const track = useMemo(() => {
    const id = EmbedableLink.slugify(embedableLink);

    const source = Source.createSoundcloud({
      embedableLink,
      soundcloudId,
      thumbnail,
    });

    return Track.create({
      id,
      title,
      source,
    });
  }, [embedableLink, soundcloudId, thumbnail, title]);

  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    register({ track, weight });

    loadSoundcloud({
      track,
    })();
  }, [track, weight]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={track.source.container} tabIndex={-1} />
      </VisuallyAndAriaHidden>
      <TrackBar id={track.id} />
    </>
  );
}
