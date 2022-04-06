import { createFoldObject } from "@fp51/foldable-helpers";

export type Youtube = {
  type: "Youtube";
  player: unknown;
};

export type Soundcloud = {
  type: "Soundcloud";
  widget: unknown;
};

export type Bandcamp = {
  type: "Bandcamp";
  audio: HTMLAudioElement;
};

export type Source = Youtube | Soundcloud | Bandcamp;

export const isYoutube = (source: Source): source is Youtube =>
  source.type === "Youtube";
export const isSoundcloud = (source: Source): source is Soundcloud =>
  source.type === "Soundcloud";
export const isBandcamp = (source: Source): source is Bandcamp =>
  source.type === "Bandcamp";

export const fold = createFoldObject({
  Youtube: isYoutube,
  Soundcloud: isSoundcloud,
  Bandcamp: isBandcamp,
});

export function createYoutube({ player }: { player: unknown }): Youtube {
  return {
    type: "Youtube",
    player,
  };
}

export function createSoundcloud({ widget }: { widget: unknown }): Soundcloud {
  return {
    type: "Soundcloud",
    widget,
  };
}

export function createBandcamp({
  audio,
}: {
  audio: HTMLAudioElement;
}): Bandcamp {
  return {
    type: "Bandcamp",
    audio,
  };
}
