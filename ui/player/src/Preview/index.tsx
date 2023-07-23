"use client";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import {
  usePlayer,
  Tracks,
  Track,
  playOrPause,
  play,
  saveAutoplayChoice,
} from "@cmd/domain-player";

import { Small } from "@cmd/ui-text";

import * as Button from "../components/Button";
import Progress from "../components/Progress";
import TrackText from "../components/TrackText";
import AbortedText from "../components/AbortedText";
import Thumbnail from "../components/Thumbnail";

import * as styles from "./Preview.css";

function Player({
  track,
  next,
  prev,
}: {
  track: Track.Track;
  next: Option.Option<Track.Track>;
  prev: Option.Option<Track.Track>;
}) {
  return (
    <div className={styles.player}>
      <div className={styles.commandBar}>
        <div className={styles.commandPrev}>
          {Option.isSome(prev) && Track.isInitialized(prev.value) && (
            <Button.Prev
              onClick={play(prev.value)}
              trackName={prev.value.title}
            />
          )}
        </div>
        <div className={styles.commandPlayPause}>
          {!Track.isInteractive(track) && <Button.Loading size="medium" />}
          {Track.isInteractive(track) &&
            (Track.isPlaying(track) ? (
              <Button.Pause
                size="medium"
                trackName={track.title}
                onClick={playOrPause}
              />
            ) : (
              <Button.Play
                size="medium"
                trackName={track.title}
                onClick={playOrPause}
              />
            ))}
        </div>
        <div className={styles.commandNext}>
          {Option.isSome(next) && Track.isInitialized(next.value) && (
            <Button.Next
              onClick={play(next.value)}
              trackName={next.value.title}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AutoPlay({ autoplayEnabled }: { autoplayEnabled: boolean }) {
  return (
    <div className={styles.autoPlay}>
      <div className={styles.autoPlayLabel} aria-hidden>
        <Small>
          {autoplayEnabled ? "Lecture auto activée" : "Lecture auto désactivée"}
        </Small>
      </div>
      <div className={styles.autoPlayButton}>
        <Button.AutoPlay
          status={autoplayEnabled ? "on" : "off"}
          onClick={saveAutoplayChoice(!autoplayEnabled)}
        />
      </div>
    </div>
  );
}

export function Preview() {
  const tracks = usePlayer();

  if (Tracks.isEmpty(tracks)) {
    return null;
  }

  const { autoplayEnabled } = tracks;

  const selectedTrack = Tracks.selectedTrack(tracks);

  const nextTrack = pipe(tracks, Tracks.nextTrack);
  const prevTrack = pipe(tracks, Tracks.prevTrack);

  return (
    <div className={`${styles.preview}`}>
      <div className={styles.thumbnail}>
        <Thumbnail source={selectedTrack.source} />
      </div>

      <div className={styles.text}>
        <TrackText track={selectedTrack} />
      </div>

      {Track.isAborted(selectedTrack) ? (
        <div className={styles.aborted}>
          <AbortedText />
        </div>
      ) : (
        <Player track={selectedTrack} prev={prevTrack} next={nextTrack} />
      )}

      <AutoPlay autoplayEnabled={autoplayEnabled} />

      {Track.isInitialized(selectedTrack) && (
        <div className={styles.progress}>
          <Progress track={selectedTrack} />
        </div>
      )}
    </div>
  );
}
