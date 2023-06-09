"use client";

import { useEffect, useMemo } from "react";

import {
  register,
  loadYoutube,
  Track,
  Source,
  EmbedableLink,
} from "@cmd/domain-player";

import { VisuallyAndAriaHidden } from "../components/Hidden";

import TrackBar from "./TrackBar";

export function YoutubeClient({
  embedableLink,
  title,
  weight,
}: {
  embedableLink: EmbedableLink.Youtube;
  title: string;
  weight: number;
}) {
  const track = useMemo(() => {
    const id = EmbedableLink.slugify(embedableLink);

    const source = Source.createYoutube({
      embedableLink,
    });

    return Track.create({
      id,
      title,
      source,
    });
  }, [embedableLink, title]);

  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    register({ track, weight });

    loadYoutube({
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
