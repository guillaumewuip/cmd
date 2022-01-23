import * as IO from "fp-ts/IO";
import * as Option from "fp-ts/Option";
import * as Either from "fp-ts/Either";
import * as TaskEither from "fp-ts/TaskEither";
import * as IOEither from "fp-ts/IOEither";
import { identity, pipe } from "fp-ts//function";

import throttle from "lodash.throttle";

import * as Tracks from "../entities/Tracks";
import * as Track from "../entities/Track";
import * as Source from "../entities/TrackSource";
import * as Position from "../entities/Position";

import * as Store from "../store";

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

    if (Track.id(selectedTrack) !== trackId) {
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
  return () => (Source.player(source) as any).seekTo(0);
}

function playYoutube(source: Source.Youtube): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (Source.player(source) as any).playVideo();
}

function pauseYoutube(source: Source.Youtube): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (Source.player(source) as any).pauseVideo();
}

function resetSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (Source.widget(source) as any).seekTo(0);
}

function playSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (Source.widget(source) as any).play();
}

function pauseSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (Source.widget(source) as any).pause();
}

function resetBandcamp(source: Source.Bandcamp): IO.IO<void> {
  return () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Source.audio(source) as any).currentTime = 0;
  };
}

function pauseBandcamp(source: Source.Bandcamp): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (Source.audio(source) as any).pause();
}

function playBandcamp(source: Source.Bandcamp): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => (Source.audio(source) as any).play();
}

export function reset(track: Track.Initialized): IO.IO<void> {
  return pipe(
    track,
    Track.source,
    Source.fold({
      Youtube: resetYoutube,
      Soundcloud: resetSoundcloud,
      Bandcamp: resetBandcamp,
    })
  );
}

export function play(track: Track.Initialized): IO.IO<void> {
  return pipe(
    track,
    Track.source,
    Source.fold({
      Youtube: playYoutube,
      Soundcloud: playSoundcloud,
      Bandcamp: playBandcamp,
    })
  );
}

export function pause(track: Track.Initialized): IO.IO<void> {
  return pipe(
    track,
    Track.source,
    Source.fold({
      Youtube: pauseYoutube,
      Soundcloud: pauseSoundcloud,
      Bandcamp: pauseBandcamp,
    })
  );
}

const aborted = doIfSelectedTrack((track: Track.Initialized) =>
  Store.write(
    Tracks.modifyIfNotEmpty(
      Tracks.modifyTrack(Track.id(track), () => Track.aborted(track))
    )
  )
);

const buffering = doIfSelectedTrack((track: Track.Initialized) =>
  Store.write(
    Tracks.modifyIfNotEmpty(
      Tracks.modifyTrack(Track.id(track), (localTrack) => {
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
        Tracks.modifyTrack(Track.id(track), (localTrack) => {
          if (!Track.isInteractive(localTrack)) {
            return localTrack;
          }

          return Track.positionChanged(getPosition())(localTrack);
        })
      )
    )
  );

const durationUpdate = (duration: number) =>
  doIfSelectedTrack((track: Track.Initialized) =>
    Store.write(
      Tracks.modifyIfNotEmpty(
        Tracks.modifyTrack(Track.id(track), (localTrack) => {
          if (!Track.isInitialized(localTrack)) {
            return localTrack;
          }

          return Track.updateDuration(duration)(localTrack);
        })
      )
    )
  );

const playing = doIfSelectedTrack((track: Track.Initialized) =>
  Store.write(
    Tracks.modifyIfNotEmpty(
      Tracks.modifyTrack(
        Track.id(track),
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
        Track.id(track),
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

        if (!Tracks.autoplayEnabled(tracks)) {
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

      if (Track.eqId.equals(selectedTrack, track)) {
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
  track,
  container,
}: {
  track: Track.Reserved;
  container: HTMLElement;
}): TaskEither.TaskEither<Error, void> {
  const trackId = Track.id(track);

  return pipe(
    TaskEither.tryCatch(
      (): Promise<Source.TrackSource> =>
        new Promise((resolve, reject) => {
          try {
            window.YT.ready(() => {
              const player = new window.YT.Player(container, {
                height: "390",
                width: "640",
                videoId: trackId,
                events: {
                  onReady: () => {
                    paused(trackId)();
                  },
                  onError: () => {
                    aborted(trackId)();
                  },
                  onStateChange: ({ data: event }: { data: unknown }) => {
                    switch (event) {
                      case window.YT.PlayerState.BUFFERING:
                        buffering(trackId)();
                        break;

                      case window.YT.PlayerState.ENDED:
                        ended(trackId)();
                        break;

                      case window.YT.PlayerState.PLAYING:
                        playing(trackId)();
                        durationUpdate(player.getDuration())(trackId)();
                        break;

                      case window.YT.PlayerState.PAUSED:
                        paused(trackId)();
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

                  const position = Position.create(time / duration);

                  positionUpdate(() => position)(trackId)();
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
    TaskEither.chainFirstIOK((source) =>
      updateTrack(Track.id(track), () => Track.initialized({ source })(track))
    ),
    TaskEither.map(() => undefined)
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
  track,
  iframe,
}: {
  track: Track.Reserved;
  iframe: HTMLIFrameElement;
}): TaskEither.TaskEither<Error, void> {
  const trackId = Track.id(track);

  return pipe(
    IOEither.tryCatch(() => {
      const widget = new window.SC.Widget(iframe);

      // force reload
      const newWidgetUrl = `http://api.soundcloud.com/tracks/${trackId}`;
      widget.load(newWidgetUrl);

      const source = Source.createSoundcloud({
        widget,
      });

      widget.bind(window.SC.Widget.Events.ERROR, () => {
        aborted(trackId)();
      });
      widget.bind(window.SC.Widget.Events.READY, () => {
        paused(trackId)();
      });

      widget.bind(window.SC.Widget.Events.LOAD_PROGRESS, () => {
        buffering(trackId)();
      });

      widget.bind(window.SC.Widget.Events.PLAY, () => {
        playing(trackId)();
      });

      widget.bind(
        window.SC.Widget.Events.PLAY_PROGRESS,
        throttle(({ relativePosition, currentPosition }) => {
          positionUpdate(() => Position.create(relativePosition))(trackId)();

          if (relativePosition) {
            // millis to seconds conversion
            durationUpdate(currentPosition / 1000 / relativePosition)(
              trackId
            )();
          }
        }, 1000)
      );

      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        paused(trackId)();
      });

      widget.bind(window.SC.Widget.Events.FINISH, () => {
        ended(trackId)();
      });

      return source;
    }, Either.toError),
    IOEither.chainFirstIOK((source) =>
      updateTrack(Track.id(track), () => Track.initialized({ source })(track))
    ),
    IOEither.map(() => undefined),
    TaskEither.fromIOEither
  );
}

export function loadBandcamp({
  track,
  streamUrl,
}: {
  track: Track.Reserved;
  streamUrl: string;
}): TaskEither.TaskEither<Error, void> {
  const trackId = Track.id(track);

  return pipe(
    IOEither.tryCatch(() => {
      const audio = new Audio(streamUrl);

      const source = Source.createBandcamp({
        audio,
      });

      audio.addEventListener("abort", () => {
        aborted(trackId)();
      });
      audio.addEventListener("error", () => {
        aborted(trackId)();
      });

      audio.addEventListener("loadeddata", () => {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
        if (audio.readyState >= 2) {
          paused(trackId)();
        }
      });

      audio.addEventListener("waiting", () => {
        buffering(trackId)();
      });

      audio.addEventListener("play", () => {
        playing(trackId)();
      });
      audio.addEventListener("playing", () => {
        playing(trackId)();
        durationUpdate(audio.duration)(trackId)();
      });

      audio.addEventListener("timeupdate", () =>
        positionUpdate(() =>
          Position.create(audio.currentTime / audio.duration)
        )(trackId)()
      );

      audio.addEventListener("pause", () => {
        paused(trackId)();
      });

      audio.addEventListener("ended", () => {
        ended(trackId)();
      });

      return source;
    }, Either.toError),
    IOEither.chainFirstIOK((source) =>
      updateTrack(Track.id(track), () => Track.initialized({ source })(track))
    ),
    IOEither.map(() => undefined),
    TaskEither.fromIOEither
  );
}
