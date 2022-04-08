import * as Option from "fp-ts/Option";
import * as Either from "fp-ts/Either";
import * as IO from "fp-ts/IO";
import * as IOEither from "fp-ts/IOEither";
import * as Task from "fp-ts/Task";
import * as TaskEither from "fp-ts/TaskEither";
import { identity, pipe } from "fp-ts/function";

import throttle from "lodash.throttle";

import { capDelay, exponentialBackoff, limitRetries, Monoid } from "retry-ts";
import { retrying } from "retry-ts/Task";

import * as Tracks from "../entities/Tracks";
import * as Track from "../entities/Track";
import * as Source from "../entities/Source";
import * as Position from "../entities/Position";

import * as Store from "../store";

const taskRetryPolicy = capDelay(
  6000,
  Monoid.concat(exponentialBackoff(300), limitRetries(6))
);

const BASE_API = "https://cmd-apis.vercel.app";

function updateTrack(
  trackId: string,
  modifier: (track: Track.Track) => Track.Track
): IO.IO<void> {
  return Store.write(
    Tracks.modifyIfNotEmpty(Tracks.modifyTrack(trackId, modifier))
  );
}

function doIfSelectedTrack(
  callback: (track: Track.Initialized) => IO.IO<void>
) {
  return (trackId: string): IO.IO<void> => {
    const state = Store.read();

    if (Tracks.isEmpty(state)) {
      return IO.of(undefined);
    }

    const selectedTrack = Tracks.selectedTrack(state);

    if (selectedTrack.id !== trackId) {
      return IO.of(undefined);
    }

    if (!Track.isInitialized(selectedTrack)) {
      return IO.of(undefined);
    }

    return callback(selectedTrack);
  };
}

function resetYoutube(source: Source.Youtube): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (source.player as any).seekTo(0);
}

function playYoutube(source: Source.Youtube): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (source.player as any).playVideo();
}

function pauseYoutube(source: Source.Youtube): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (source.player as any).pauseVideo();
}

function resetSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (source.widget as any).seekTo(0);
}

function playSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (source.widget as any).play();
}

function pauseSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (source.widget as any).pause();
}

function resetBandcamp(source: Source.Bandcamp): IO.IO<void> {
  return () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-param-reassign
    (source.audio as any).currentTime = 0;
  };
}

function pauseBandcamp(source: Source.Bandcamp): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (source.audio as any).pause();
}

function playBandcamp(source: Source.Bandcamp): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (source.audio as any).play();
}

export function reset(track: Track.Initialized): IO.IO<void> {
  switch (track.source.type) {
    case "Youtube":
      return resetYoutube(track.source);
    case "Soundcloud":
      return resetSoundcloud(track.source);
    case "Bandcamp":
      return resetBandcamp(track.source);
  }
}

export function play(track: Track.Initialized): IO.IO<void> {
  switch (track.source.type) {
    case "Youtube":
      return playYoutube(track.source);
    case "Soundcloud":
      return playSoundcloud(track.source);
    case "Bandcamp":
      return playBandcamp(track.source);
  }
}

export function pause(track: Track.Initialized): IO.IO<void> {
  switch (track.source.type) {
    case "Youtube":
      return pauseYoutube(track.source);
    case "Soundcloud":
      return pauseSoundcloud(track.source);
    case "Bandcamp":
      return pauseBandcamp(track.source);
  }
}

const aborted = doIfSelectedTrack((track: Track.Initialized) =>
  Store.write(
    Tracks.modifyIfNotEmpty(
      Tracks.modifyTrack(track.id, () => Track.aborted(track))
    )
  )
);

const buffering = doIfSelectedTrack((track: Track.Initialized) =>
  Store.write(
    Tracks.modifyIfNotEmpty(
      Tracks.modifyTrack(track.id, (localTrack) => {
        if (!Track.isInteractive(localTrack)) {
          return localTrack;
        }

        return Track.buffering(localTrack);
      })
    )
  )
);

const positionUpdate = (getPosition: () => Position.Position) =>
  doIfSelectedTrack((track: Track.Initialized) =>
    Store.write(
      Tracks.modifyIfNotEmpty(
        Tracks.modifyTrack(track.id, (localTrack) => {
          if (!Track.isInteractive(localTrack)) {
            return localTrack;
          }

          return {
            ...localTrack,
            position: getPosition(),
          };
        })
      )
    )
  );

const durationUpdate = (duration: number) =>
  doIfSelectedTrack((track: Track.Initialized) =>
    Store.write(
      Tracks.modifyIfNotEmpty(
        Tracks.modifyTrack(track.id, (localTrack) => {
          if (!Track.isInitialized(localTrack)) {
            return localTrack;
          }

          return {
            ...localTrack,
            duration: Option.some(duration),
          };
        })
      )
    )
  );

const playing = doIfSelectedTrack((track: Track.Initialized) =>
  Store.write(
    Tracks.modifyIfNotEmpty(
      Tracks.modifyTrack(
        track.id,
        Track.fold<Track.Track>({
          Reserved: identity,
          Aborted: identity,
          Playing: identity,
          Loading: Track.started,
          Paused: Track.resumed,
        })
      )
    )
  )
);

const paused = doIfSelectedTrack((track: Track.Track) =>
  Store.write(
    Tracks.modifyIfNotEmpty(
      Tracks.modifyTrack(
        track.id,
        Track.fold<Track.Track>({
          Reserved: identity,
          Aborted: identity,
          Paused: identity,
          Loading: Track.loaded,
          Playing: Track.paused,
        })
      )
    )
  )
);

const ended = doIfSelectedTrack((track: Track.Track) =>
  pipe(
    Store.write(
      Tracks.modifyIfNotEmpty((tracks) => {
        if (Tracks.isEmpty(tracks)) {
          return tracks;
        }

        if (!tracks.autoplayEnabled) {
          return tracks;
        }

        const maybeNextTrack = Tracks.nextTrack(tracks);

        if (Option.isNone(maybeNextTrack)) {
          return tracks;
        }

        return Tracks.selectTrack(maybeNextTrack.value)(tracks);
      })
    ),
    IO.chain(() => {
      const tracks = Store.read();

      if (Tracks.isEmpty(tracks)) {
        return IO.of(undefined);
      }

      const selectedTrack = Tracks.selectedTrack(tracks);

      if (selectedTrack.id === track.id) {
        return IO.of(undefined);
      }

      if (!Track.isInitialized(selectedTrack)) {
        return IO.of(undefined);
      }

      return play(selectedTrack);
    })
  )
);

export function reserve({
  id,
  title,
  weight,
}: {
  id: string;
  title: string;
  weight: number;
}): IO.IO<Track.Reserved> {
  const track = Track.reserved({
    id,
    title,
  });

  return pipe(
    Store.write(Tracks.addTrack(track, weight)),
    IO.map(() => track)
  );
}

interface YoutubePlayer {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (element: HTMLElement, config: object): YoutubePlayer;
  addEventListener(event: string, callback: (event: unknown) => void): void;
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
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

export function loadYoutube({
  id,
  youtubeId,
  container,
}: {
  id: string;
  youtubeId: string;
  container: HTMLElement;
}): Task.Task<void> {
  return pipe(
    TaskEither.tryCatch(
      () =>
        new Promise<Source.Source>((resolve, reject) => {
          try {
            window.YT.ready(() => {
              const player = new window.YT.Player(container, {
                height: "390",
                width: "640",
                videoId: youtubeId,
                events: {
                  onReady: () => {
                    paused(id)();
                  },
                  onError: () => {
                    aborted(id)();
                  },
                  onStateChange: ({ data: event }: { data: unknown }) => {
                    switch (event) {
                      case window.YT.PlayerState.BUFFERING:
                        buffering(id)();
                        break;

                      case window.YT.PlayerState.ENDED:
                        ended(id)();
                        break;

                      case window.YT.PlayerState.PLAYING:
                        playing(id)();
                        durationUpdate(player.getDuration())(id)();
                        break;

                      case window.YT.PlayerState.PAUSED:
                        paused(id)();
                        break;

                      default:
                        break;
                    }
                  },
                },
              });

              const source = Source.createYoutube({
                player,
              });

              setInterval(() => {
                if (
                  "getPlayerState" in player &&
                  player.getPlayerState() === window.YT.PlayerState.PLAYING
                ) {
                  const time = player.getCurrentTime();
                  const duration = player.getDuration();

                  const position = Position.create({ ratio: time / duration });

                  positionUpdate(() => position)(id)();
                }
              }, 1000);

              resolve(source);
            });
          } catch (error) {
            reject(error);
          }
        }),
      Either.toError
    ),
    Task.chainIOK(
      Either.fold(
        () => updateTrack(id, Track.aborted),
        (source) => updateTrack(id, Track.initialized({ source }))
      )
    )
  );
}

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

export function loadSoundcloud({
  id,
  soundcloudUrl,
  container,
}: {
  id: string;
  soundcloudUrl: string;
  container: HTMLElement;
}): Task.Task<void> {
  return pipe(
    retrying(
      taskRetryPolicy,
      () =>
        TaskEither.tryCatch(async () => {
          const response = await fetch(
            `${BASE_API}/api/soundcloud/track?url=${encodeURIComponent(
              soundcloudUrl
            )}`
          );

          const payload = await response.json();

          return {
            soundcloudId: payload.trackId,
          };
        }, Either.toError),
      Either.isLeft
    ),

    TaskEither.chainIOEitherK(({ soundcloudId }: { soundcloudId: string }) =>
      IOEither.tryCatch(() => {
        const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${soundcloudId}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=false&show_reposts=true&show_teaser=true`;

        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", "Embed player");
        iframe.setAttribute("height", "128");
        iframe.setAttribute("src", src);
        iframe.setAttribute("allow", "autoplay");
        iframe.setAttribute("tabIndex", "-1");
        iframe.setAttribute("seamless", "true");
        iframe.setAttribute("src", src);

        container.appendChild(iframe);

        return {
          iframe,
          soundcloudId,
        };
      }, Either.toError)
    ),

    TaskEither.chainIOEitherK(
      ({
        iframe,
        soundcloudId,
      }: {
        iframe: HTMLIFrameElement;
        soundcloudId: string;
      }) =>
        IOEither.tryCatch(() => {
          const widget = new window.SC.Widget(iframe);

          // force reload
          const newWidgetUrl = `http://api.soundcloud.com/tracks/${soundcloudId}`;
          widget.load(newWidgetUrl);

          const source = Source.createSoundcloud({
            widget,
          });

          widget.bind(window.SC.Widget.Events.ERROR, () => {
            aborted(id)();
          });
          widget.bind(window.SC.Widget.Events.READY, () => {
            paused(id)();
          });

          widget.bind(window.SC.Widget.Events.LOAD_PROGRESS, () => {
            buffering(id)();
          });

          widget.bind(window.SC.Widget.Events.PLAY, () => {
            playing(id)();
          });

          widget.bind(
            window.SC.Widget.Events.PLAY_PROGRESS,
            throttle(({ relativePosition, currentPosition }) => {
              positionUpdate(() => Position.create(relativePosition))(id)();

              if (relativePosition) {
                // millis to seconds conversion
                durationUpdate(currentPosition / 1000 / relativePosition)(id)();
              }
            }, 1000)
          );

          widget.bind(window.SC.Widget.Events.PAUSE, () => {
            paused(id)();
          });

          widget.bind(window.SC.Widget.Events.FINISH, () => {
            ended(id)();
          });

          return source;
        }, Either.toError)
    ),
    Task.chainIOK(
      Either.fold(
        () => updateTrack(id, Track.aborted),
        (source) => updateTrack(id, Track.initialized({ source }))
      )
    )
  );
}

export function loadBandcamp({
  id,
  bandcampUrl,
}: {
  id: string;
  bandcampUrl: string;
}): Task.Task<void> {
  return pipe(
    retrying(
      taskRetryPolicy,
      () =>
        TaskEither.tryCatch(async () => {
          const response = await fetch(
            `${BASE_API}/api/bandcamp/track?url=${encodeURIComponent(
              bandcampUrl
            )}`
          );

          const payload = await response.json();

          return {
            streamUrl: payload.streamUrl,
          };
        }, Either.toError),
      Either.isLeft
    ),
    TaskEither.chainIOEitherK(({ streamUrl }: { streamUrl: string }) =>
      IOEither.tryCatch(() => {
        const audio = new Audio(streamUrl);

        const source = Source.createBandcamp({
          audio,
        });

        audio.addEventListener("abort", () => {
          aborted(id)();
        });
        audio.addEventListener("error", () => {
          aborted(id)();
        });

        audio.addEventListener("loadeddata", () => {
          // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
          if (audio.readyState >= 2) {
            paused(id)();
          }
        });

        audio.addEventListener("waiting", () => {
          buffering(id)();
        });

        audio.addEventListener("play", () => {
          playing(id)();
        });
        audio.addEventListener("playing", () => {
          playing(id)();
          durationUpdate(audio.duration)(id)();
        });

        audio.addEventListener("timeupdate", () =>
          positionUpdate(() =>
            Position.create({ ratio: audio.currentTime / audio.duration })
          )(id)()
        );

        audio.addEventListener("pause", () => {
          paused(id)();
        });

        audio.addEventListener("ended", () => {
          ended(id)();
        });

        return source;
      }, Either.toError)
    ),
    Task.chainIOK(
      Either.fold(
        () => updateTrack(id, Track.aborted),
        (source) => updateTrack(id, Track.initialized({ source }))
      )
    )
  );
}
