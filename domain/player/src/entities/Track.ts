import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { createFoldObject } from "@fp51/foldable-helpers";

import * as Source from "./Source";
import * as Position from "./Position";

type Base = {
  id: string;
  title: string;
  externalUrl: string;
};

export type Reserved = Base & {
  type: "Reserved";
};

export type Aborted = Base & {
  type: "Aborted";
};

type BaseInitialized = Base & {
  duration: Option.Option<number>; // in seconds
  source: Source.Source;
};

export type Loading = BaseInitialized & {
  type: "Loading";
  position: Option.Option<Position.Position>;
};

export type Playing = BaseInitialized & {
  type: "Playing";
  position: Position.Position;
};

export type Paused = BaseInitialized & {
  type: "Paused";
  position: Position.Position;
};

export type Track = Reserved | Aborted | Loading | Playing | Paused;
export type Initialized = Loading | Playing | Paused;
export type Interactive = Playing | Paused;

export const isReserved = (track: Track): track is Reserved =>
  track.type === "Reserved";
export const isAborted = (track: Track): track is Aborted =>
  track.type === "Aborted";
export const isLoading = (track: Track): track is Loading =>
  track.type === "Loading";
export const isPlaying = (track: Track): track is Playing =>
  track.type === "Playing";
export const isPaused = (track: Track): track is Paused =>
  track.type === "Paused";

export const fold = createFoldObject({
  Reserved: isReserved,
  Aborted: isAborted,
  Loading: isLoading,
  Playing: isPlaying,
  Paused: isPaused,
});

export function isInitialized(track: Track): track is Initialized {
  return isPlaying(track) || isLoading(track) || isPaused(track);
}

export function isInteractive(track: Track): track is Interactive {
  return isPlaying(track) || isPaused(track);
}

export const reserved = (data: {
  id: string;
  title: string;
  externalUrl: string;
}): Reserved => ({
  type: "Reserved",
  id: data.id,
  title: data.title,
  externalUrl: data.externalUrl,
});

export const aborted = (track: Track): Aborted => ({
  ...track,
  type: "Aborted",
});

export const initialized =
  ({ source }: { source: Source.Source }) =>
  (track: Track): Loading => ({
    ...track,
    type: "Loading",
    source,
    duration: Option.none,
    position: Option.none,
  });

export const started = (track: Loading): Playing => ({
  ...track,
  type: "Playing",
  position: Position.start,
});

export const loaded = (track: Loading): Paused => ({
  ...track,
  type: "Paused",
  position: {
    ratio: 0,
  },
});

export const paused = (track: Playing): Paused => ({
  ...track,
  type: "Paused",
});

export const resumed = (track: Paused): Playing => ({
  ...track,
  type: "Playing",
});

export const buffering = (track: Interactive): Loading => ({
  ...track,
  type: "Loading",
  position: Option.some(track.position),
});

export const buffered = (track: Loading): Playing => ({
  ...track,
  type: "Playing",
  position: pipe(
    track.position,
    Option.getOrElse(() => Position.start)
  ),
});
