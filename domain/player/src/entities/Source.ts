import { createRef, RefObject } from "react";
import { createFoldObject } from "@fp51/foldable-helpers";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import * as EmbedableLink from "./EmbedableLink";

type Thumbnail = {
  url: string;
};

export interface YoutubePlayer {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (element: HTMLElement, config: object): YoutubePlayer;
  addEventListener(event: string, callback: (event: unknown) => void): void;
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(value: number): void;
  playVideo(): void;
  pauseVideo(): void;
}

declare global {
  interface Window {
    YT: {
      Player: YoutubePlayer;
      PlayerState: {
        BUFFERING: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
      ready: (cb: () => void) => void; // https://stackoverflow.com/a/62254596
    };
  }
}

export type Youtube = {
  type: "Youtube";
  href: string;
  trackId: string;
  container: RefObject<HTMLDivElement>;
  player: Option.Option<YoutubePlayer>;
};

type SoundcloudAudioEvent = {
  LOAD_PROGRESS: "load_progress";
  PLAY_PROGRESS: "play_progress";
  PLAY: "play";
  PAUSE: "pause";
  FINISH: "finish";
  SEEK: "seek";
};

type SoundcloudUIEvent = {
  READY: "ready";
  CLICK_DOWNLOAD: "click_download";
  CLICK_BUY: "click_buy";
  OPEN_SHARE_PANEL: "open_share_panel";
  ERROR: "error";
};

interface SoundcloudWidget {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (element: HTMLElement): SoundcloudWidget;
  bind(
    event: SoundcloudAudioEvent[keyof SoundcloudAudioEvent],
    callback: (state: {
      relativePosition: number;
      loadProgress: number;
      currentPosition: number;
    }) => void
  ): void;
  bind(
    event: SoundcloudUIEvent[keyof SoundcloudUIEvent],
    callback: () => void
  ): void;
  load(url: string): void;
  getDuration(cb: (duration: number) => void): number;
  seekTo(value: number): void;
  play(): void;
  pause(): void;
}

declare global {
  interface Window {
    SC: {
      Widget: SoundcloudWidget & {
        Events: SoundcloudAudioEvent & SoundcloudUIEvent;
      };
    };
  }
}

export type Soundcloud = {
  type: "Soundcloud";
  href: string;
  container: RefObject<HTMLDivElement>;
  thumbnail: Option.Option<Thumbnail>;
  widget: Option.Option<SoundcloudWidget>;
};

export type Bandcamp = {
  type: "Bandcamp";
  href: string;
  audio: HTMLAudioElement;
  thumbnail: Option.Option<Thumbnail>;
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

export function createYoutube({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Youtube;
}): Youtube {
  return {
    type: "Youtube",
    href: embedableLink.href,
    trackId: embedableLink.trackId,
    container: createRef(),
    player: Option.none,
  };
}

export function createSoundcloud({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Soundcloud;
}): Soundcloud {
  return {
    type: "Soundcloud",
    href: embedableLink.href,
    container: createRef(),
    thumbnail: Option.none,
    widget: Option.none,
  };
}

export function createBandcamp({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Bandcamp;
}): Bandcamp {
  return {
    type: "Bandcamp",
    href: embedableLink.href,
    audio: new Audio(),
    thumbnail: Option.none,
  };
}

export function addPlayer(player: YoutubePlayer) {
  return (source: Youtube): Youtube => {
    return {
      ...source,
      player: Option.some(player),
    };
  };
}

export function addWidget(widget: SoundcloudWidget) {
  return (source: Soundcloud): Soundcloud => {
    return {
      ...source,
      widget: Option.some(widget),
    };
  };
}

export function addThumbnail(localThumbnail: Thumbnail) {
  return (source: Source & { thumbnail: Option.Option<Thumbnail> }) => {
    return {
      ...source,
      thumbnail: Option.some(localThumbnail),
    };
  };
}

export function thumbnail(source: Source): Option.Option<Thumbnail> {
  return pipe(
    source,
    fold({
      Youtube: ({ trackId }) =>
        Option.some({
          url: `https://img.youtube.com/vi/${trackId}/hqdefault.jpg`,
        }),
      Soundcloud: ({ thumbnail: localThumbnail }) => localThumbnail,
      Bandcamp: ({ thumbnail: localThumbnail }) => localThumbnail,
    })
  );
}
