import { createFoldObject } from "@fp51/foldable-helpers";

export type Youtube = {
  type: "Youtube";
  player: unknown;
};

export type Soundcloud = {
  type: "Soundcloud";
  widget: unknown;
  thumbnail: {
    url: string;
  };
};

export type Bandcamp = {
  type: "Bandcamp";
  audio: HTMLAudioElement;
  thumbnail: {
    url: string;
  };
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

export function createSoundcloud({
  widget,
  thumbnail,
}: {
  widget: unknown;
  thumbnail: {
    url: string;
  };
}): Soundcloud {
  return {
    type: "Soundcloud",
    widget,
    thumbnail,
  };
}

export function createBandcamp({
  audio,
  thumbnail,
}: {
  audio: HTMLAudioElement;

  thumbnail: {
    url: string;
  };
}): Bandcamp {
  return {
    type: "Bandcamp",
    audio,
    thumbnail,
  };
}
