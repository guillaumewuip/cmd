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

import { H2, Small } from "@cmd/ui-text";

import * as Button from "../components/Button";
import {
  Line as ProgressLine,
  TotalTime,
  TimePassed,
} from "../components/Progress";
import AbortedText from "../components/AbortedText";
import Thumbnail from "../components/Thumbnail";

import * as styles from "./Preview.css";

function PlayPause({ track }: { track: Track.Track }) {
  return (
    <>
      {!Track.isInteractive(track) && <Button.Loading />}
      {Track.isInteractive(track) &&
        (Track.isPlaying(track) ? (
          <Button.Pause trackName={track.title} onClick={playOrPause} />
        ) : (
          <Button.Play trackName={track.title} onClick={playOrPause} />
        ))}
    </>
  );
}

function PrevNext({
  next,
  prev,
}: {
  next: Option.Option<Track.Track>;
  prev: Option.Option<Track.Track>;
}) {
  return (
    <div className={styles.commandBar}>
      <div className={styles.commandPrev}>
        {Option.isSome(prev) && Track.isInitialized(prev.value) && (
          <Button.Prev
            onClick={play(prev.value)}
            trackName={prev.value.title}
          />
        )}
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

function Title({ track }: { track: Track.Track }) {
  return (
    <>
      <H2 noMargin>{track.title}</H2>
      {Track.hasTimeInfos(track) && (
        <>
          <TimePassed track={track} /> / <TotalTime track={track} />
        </>
      )}
    </>
  );
}

export function Preview() {
  const tracks = usePlayer();

  if (Tracks.isEmpty(tracks)) {
    return <div className={`${styles.preview}`} />;
  }

  const { autoplayEnabled } = tracks;

  const selectedTrack = Tracks.selectedTrack(tracks);

  const nextTrack = pipe(tracks, Tracks.nextTrack);
  const prevTrack = pipe(tracks, Tracks.prevTrack);

  return (
    <div className={`${styles.preview}`}>
      <div className={styles.content}>
        <div className={styles.thumbnail}>
          <Thumbnail source={selectedTrack.source} />
        </div>

        <div className={styles.leftButtons}>
          {!Track.isAborted(selectedTrack) && (
            <PlayPause track={selectedTrack} />
          )}
        </div>

        <div className={styles.title}>
          {Track.isAborted(selectedTrack) ? (
            <AbortedText />
          ) : (
            <Title track={selectedTrack} />
          )}
        </div>

        <div className={styles.rightButtons}>
          <PrevNext next={nextTrack} prev={prevTrack} />
        </div>

        <div className={styles.options}>
          <AutoPlay autoplayEnabled={autoplayEnabled} />
        </div>
      </div>

      <div className={styles.progress}>
        {Track.isInitialized(selectedTrack) && (
          <ProgressLine track={selectedTrack} />
        )}
      </div>
    </div>
  );
}
