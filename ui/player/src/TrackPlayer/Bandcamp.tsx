"use client";

import { useEffect, useMemo } from "react";

import {
  register,
  loadBandcamp,
  Track,
  Source,
  EmbedableLink,
} from "@cmd/domain-player";

import TrackBar from "./TrackBar";

export function BandcampClient({
  embedableLink,
  streamUrl,
  thumbnail,
  title,
  weight,
}: {
  embedableLink: EmbedableLink.Bandcamp;
  streamUrl: string;
  thumbnail: string;
  title: string;
  weight: number;
}) {
  const track = useMemo(() => {
    const id = EmbedableLink.slugify(embedableLink);

    const source = Source.createBandcamp({
      embedableLink,
      streamUrl,
      thumbnail,
    });

    return Track.create({
      id,
      title,
      source,
    });
  }, [embedableLink, streamUrl, thumbnail, title]);

  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    register({ track, weight });

    loadBandcamp({
      track,
    })();
  }, [track, weight]);

  return <TrackBar id={track.id} />;
}
