import * as Option from "fp-ts/Option";
import * as Either from "fp-ts/Either";
import * as IO from "fp-ts/IO";
import * as Task from "fp-ts/Task";
import * as TaskEither from "fp-ts/TaskEither";
import { identity, pipe } from "fp-ts/function";

import throttle from "lodash.throttle";

import * as Tracks from "../entities/Tracks";
import * as Track from "../entities/Track";
import * as Source from "../entities/Source";
import * as Position from "../entities/Position";

import * as Store from "../store";

import { retry } from "./retry";

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
  return () => {
    if (Option.isNone(source.player)) {
      return;
    }

    source.player.value.seekTo(0);
  };
}

function playYoutube(source: Source.Youtube): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => {
    if (Option.isNone(source.player)) {
      return;
    }

    source.player.value.playVideo();
  };
}

function pauseYoutube(source: Source.Youtube): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => {
    if (Option.isNone(source.player)) {
      return;
    }

    source.player.value.pauseVideo();
  };
}

function resetSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => {
    if (Option.isNone(source.widget)) {
      return;
    }

    source.widget.value.seekTo(0);
  };
}

function playSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => {
    if (Option.isNone(source.widget)) {
      return;
    }

    source.widget.value.play();
  };
}

function pauseSoundcloud(source: Source.Soundcloud): IO.IO<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => {
    if (Option.isNone(source.widget)) {
      return;
    }

    source.widget.value.pause();
  };
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

export function register({
  track,
  weight,
}: {
  track: Track.Reserved;
  weight: number;
}): IO.IO<Track.Reserved> {
  return pipe(
    Store.write(Tracks.addTrack(track, weight)),
    IO.map(() => track)
  );
}

export function loadYoutube({
  track,
}: {
  track: Track.Reserved & { source: Source.Youtube };
}): Task.Task<void> {
  const { id, source } = track;
  const videoId = source.trackId;

  return pipe(
    retry(() =>
      TaskEither.tryCatch(
        () =>
          new Promise<Source.YoutubePlayer>((resolve, reject) => {
            try {
              const container = source.container.current;

              if (!container) {
                throw new Error("Empty Youtube container");
              }

              window.YT.ready(() => {
                const player = new window.YT.Player(container, {
                  height: "390",
                  width: "640",
                  videoId,
                  events: {
                    onReady: () => {
                      paused(id)();
                    },
                    onError: (error: unknown) => {
                      // eslint-disable-next-line no-console
                      console.error(error);
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

                setInterval(() => {
                  if (
                    "getPlayerState" in player &&
                    player.getPlayerState() === window.YT.PlayerState.PLAYING
                  ) {
                    const time = player.getCurrentTime();
                    const duration = player.getDuration();

                    const position = Position.create({
                      ratio: time / duration,
                    });

                    positionUpdate(() => position)(id)();
                  }
                }, 1000);

                resolve(player);
              });
            } catch (error) {
              reject(error);
            }
          }),
        Either.toError
      )
    ),
    Task.chainIOK(
      Either.fold(
        (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          return aborted(id);
        },
        (player) =>
          updateTrack(id, (localTrack) =>
            pipe(
              localTrack,
              Track.initialized,
              Track.modifySource(
                Source.fold<Source.Source>({
                  Youtube: Source.addPlayer(player),
                  Soundcloud: identity,
                  Bandcamp: identity,
                })
              )
            )
          )
      )
    )
  );
}

export function loadSoundcloud({
  track,
}: {
  track: Track.Reserved & { source: Source.Soundcloud };
}): Task.Task<void> {
  const { id, source } = track;

  return pipe(
    retry(() =>
      TaskEither.tryCatch(async () => {
        const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${source.soundcloudId}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=false&show_reposts=true&show_teaser=true`;

        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", "Embed player");
        iframe.setAttribute("height", "128");
        iframe.setAttribute("src", src);
        iframe.setAttribute("allow", "autoplay");
        iframe.setAttribute("tabIndex", "-1");
        iframe.setAttribute("seamless", "true");
        iframe.setAttribute("src", src);

        const container = source.container.current;
        if (!container) {
          throw new Error("Empty Soundcloud container");
        }

        container.appendChild(iframe);

        const widget = new window.SC.Widget(iframe);

        // force reload
        const newWidgetUrl = `http://api.soundcloud.com/tracks/${source.soundcloudId}`;
        widget.load(newWidgetUrl);

        widget.bind(window.SC.Widget.Events.ERROR, (error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(error);
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
            const duration = currentPosition / 1000 / relativePosition;
            const newPosition = Position.create({ ratio: relativePosition });

            positionUpdate(() => newPosition)(id)();

            if (!Number.isNaN(duration)) {
              // millis to seconds conversion
              durationUpdate(duration)(id)();
            }
          }, 1000)
        );

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          paused(id)();
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          ended(id)();
        });

        return { widget };
      }, Either.toError)
    ),
    Task.chainIOK(
      Either.fold(
        (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          return aborted(id);
        },
        ({ widget }) =>
          updateTrack(id, (localTrack) =>
            pipe(
              localTrack,
              Track.initialized,
              Track.modifySource(
                Source.fold<Source.Source>({
                  Youtube: identity,
                  Soundcloud: Source.addWidget(widget),
                  Bandcamp: identity,
                })
              )
            )
          )
      )
    )
  );
}

export function loadBandcamp({
  track,
}: {
  track: Track.Reserved & { source: Source.Bandcamp };
}): Task.Task<void> {
  const { id, source } = track;
  const { audio, streamUrl } = source;

  return pipe(
    retry(() =>
      TaskEither.tryCatch(async () => {
        audio.src = streamUrl;

        audio.addEventListener("abort", (error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(error);
          aborted(id)();
        });
        audio.addEventListener("error", (error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(error);
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
      }, Either.toError)
    ),
    Task.chainIOK(
      Either.fold(
        (error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          return aborted(id);
        },
        () => updateTrack(id, Track.initialized)
      )
    )
  );
}
