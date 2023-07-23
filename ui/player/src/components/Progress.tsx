import format from "date-fns/lightFormat";
import getHours from "date-fns/getHours";
import addHours from "date-fns/addHours";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import { Monospace } from "@cmd/ui-text";

import { Track } from "@cmd/domain-player";
import { useState, useEffect, useRef } from "react";

import * as styles from "./Progress.css";

function formatSeconds(seconds: number): string {
  const date = new Date(seconds * 1000);

  const timezoneDiff = date.getTimezoneOffset() / 60;
  const dateWithoutTimezoneDiff = addHours(date, timezoneDiff);

  if (getHours(dateWithoutTimezoneDiff)) {
    return format(dateWithoutTimezoneDiff, "HH:mm:ss");
  }

  return format(dateWithoutTimezoneDiff, "mm:ss");
}

export function useTick() {
  const [tick, setTick] = useState(0);

  const isUnMountedRef = useRef<boolean>(false);

  useEffect(() => {
    const animate = () => {
      if (isUnMountedRef.current) {
        return;
      }

      setTick((localTick) => (localTick + 4) % 100);

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 50);
    };

    animate();

    return () => {
      isUnMountedRef.current = true;
    };
  }, []);

  return tick;
}

const computeRatio = (track: Track.Interactive | Track.Loading) =>
  pipe(
    track,
    (localTrack) =>
      Track.isInteractive(localTrack)
        ? Option.some(localTrack.position)
        : localTrack.position,
    Option.map((localTrack) => localTrack.ratio),
    Option.chain(Option.fromNullable),
    Option.getOrElse(() => 0)
  );

export function Line({
  track,
  showBackgroundLine = false,
}: {
  track: Track.Interactive | Track.Loading;
  showBackgroundLine?: boolean;
}) {
  const tick = useTick();

  const ratio = computeRatio(track);

  return (
    <svg
      className={styles.svg}
      width="100%"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {showBackgroundLine && (
        <path className={styles.backgroundLine} d="M0 3.5h100" />
      )}
      {ratio && (
        <path
          className={styles.activeLine}
          strokeDasharray={`${ratio * 100} ${(1 - ratio) * 100}`}
          d="M0 3.5h100"
        />
      )}
      {Track.isLoading(track) && (
        <path
          className={styles.activeLine}
          strokeDashoffset={-(ratio * (100 - tick) + tick)}
          strokeDasharray="4 96"
          d="M0 3.5h100"
        />
      )}
    </svg>
  );
}

export function TimePassed({
  track,
}: {
  track: Track.Interactive | Track.Loading;
}) {
  const { duration } = track;

  const ratio = computeRatio(track);

  return (
    <Monospace>
      {Option.isSome(duration)
        ? formatSeconds(duration.value * ratio)
        : "00:00"}
    </Monospace>
  );
}

export function TotalTime({
  track,
}: {
  track: Track.Initialized & { duration: Option.Some<number> };
}) {
  const { duration } = track;

  return (
    <Monospace>
      {Option.isSome(duration) && formatSeconds(duration.value)}
    </Monospace>
  );
}

export default function Progress({
  track,
}: {
  track: Track.Interactive | Track.Loading;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.timeLeft}>
        {Track.hasTimeInfos(track) && <TimePassed track={track} />}
      </div>
      <Line track={track} showBackgroundLine />
      <div className={styles.timeRight}>
        {Track.hasTimeInfos(track) && <TotalTime track={track} />}
      </div>
    </div>
  );
}
