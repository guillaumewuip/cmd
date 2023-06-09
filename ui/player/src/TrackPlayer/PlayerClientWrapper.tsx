"use client";

import { useLayoutEffect, useRef, useState } from "react";

import * as Option from "fp-ts/Option";

import { previousTitle } from "./previousTitle";
import { position } from "./position";

type TrackPositionInfos = {
  title: string;
  weight: number;
};

export function PlayerClientWrapper({
  children,
}: {
  children: (infos: TrackPositionInfos) => React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  const [infos, setTrackInfos] = useState<TrackPositionInfos | null>(null);

  useLayoutEffect(() => {
    if (!container.current) {
      throw new Error(`Container is not mounted`);
    }

    const title = previousTitle(container.current);
    const weight = position(container.current);

    if (Option.isNone(title)) {
      throw new Error(`title not found for track ${weight}`);
    }

    setTrackInfos({ title: title.value, weight });
  }, []);

  return <div ref={container}>{infos && children(infos)}</div>;
}
