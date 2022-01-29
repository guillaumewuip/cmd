import { useState, useEffect, useRef } from "react";
import format from "date-fns/lightFormat";
import getHours from "date-fns/getHours";
import addHours from "date-fns/addHours";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import { Monospace } from "@cmd/ui-text";

import { Track, Position } from "@cmd/domain-player";

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

function useTick() {
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

function Line({
  ratio = 0,
  loading = false,
}: {
  ratio?: number;
  loading?: boolean;
}) {
  const tick = useTick();

  // just to show a little marker even if track not started
  const realRatio = loading ? ratio : Math.max(0.005, ratio);

  return (
    <svg
      className={styles.svg}
      width="100%"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={styles.backgroundLine} d="M0 3.5h100" />
      {realRatio && (
        <path
          className={styles.activeLine}
          strokeDasharray={`${realRatio * 100} ${(1 - realRatio) * 100}`}
          d="M0 3.5h100"
        />
      )}
      {loading && (
        <path
          className={styles.activeLine}
          strokeDashoffset={-(realRatio * (100 - tick) + tick)}
          strokeDasharray="4 96"
          d="M0 3.5h100"
        />
      )}
    </svg>
  );
}

export default function Progress({
  track,
}: {
  track: Track.PlayingOrPaused | Track.Loading;
}) {
  const duration = pipe(track, Track.duration);

  const ratio = pipe(
    track,
    (localTrack) =>
      Track.isInteractive(localTrack)
        ? Option.some(Track.position(localTrack))
        : Track.maybePosition(localTrack),
    Option.map(Position.ratio),
    Option.getOrElse(() => 0)
  );
  return (
    <div className={styles.wrapper}>
      <div className={styles.timeLeft}>
        <Monospace>
          {Option.isSome(duration)
            ? formatSeconds(duration.value * ratio)
            : "00:00"}
        </Monospace>
      </div>
      <Line ratio={ratio} loading={Track.isLoading(track)} />
      <div className={styles.timeRight}>
        <Monospace>
          {Option.isSome(duration) && formatSeconds(duration.value)}
        </Monospace>
      </div>
    </div>
  );
}
