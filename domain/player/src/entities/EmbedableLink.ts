import * as Option from "fp-ts/Option";

import { createFoldObject } from "@fp51/foldable-helpers";

export type Youtube = {
  type: "Youtube";
  trackId: string;
  href: string;
};

export type Soundcloud = {
  type: "Soundcloud";
  href: string;
};

export type Bandcamp = {
  type: "Bandcamp";
  href: string;
};

export type EmbedableLink = Youtube | Soundcloud | Bandcamp;

export const isYoutube = (link: EmbedableLink): link is Youtube =>
  link.type === "Youtube";
export const isSoundcloud = (link: EmbedableLink): link is Soundcloud =>
  link.type === "Soundcloud";
export const isBandcamp = (link: EmbedableLink): link is Bandcamp =>
  link.type === "Bandcamp";

export const fold = createFoldObject({
  Youtube: isYoutube,
  Soundcloud: isSoundcloud,
  Bandcamp: isBandcamp,
});

export function parseLink(text: string): Option.Option<EmbedableLink> {
  if (text.includes("youtube.com/watch")) {
    const result = text.match(/.*v=(?<id>.*)/);

    if (result === null) {
      return Option.none;
    }

    const { groups: { id } = { id: undefined } } = result;

    if (id === undefined) {
      return Option.none;
    }

    return Option.some({
      type: "Youtube",
      trackId: id,
      href: text,
    });
  }

  if (text.includes("soundcloud.com/")) {
    return Option.some({ type: "Soundcloud", href: text });
  }

  if (text.includes("bandcamp.com/track")) {
    return Option.some({ type: "Bandcamp", href: text });
  }

  return Option.none;
}

export function slugify(link: EmbedableLink): string {
  return link.href
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[-\s]+/g, "-");
}
