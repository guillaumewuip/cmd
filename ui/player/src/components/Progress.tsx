import format from "date-fns/lightFormat";
import getHours from "date-fns/getHours";
import addHours from "date-fns/addHours";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import { Monospace } from "@cmd/ui-text";

import { Track } from "@cmd/domain-player";
import { Line } from "./Line";

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

export default function Progress({
  track,
}: {
  track: Track.Interactive | Track.Loading;
}) {
  const { duration } = track;

  const ratio = pipe(
    track,
    (localTrack) =>
      Track.isInteractive(localTrack)
        ? Option.some(localTrack.position)
        : localTrack.position,
    Option.map((localTrack) => localTrack.ratio),
    Option.chain(Option.fromNullable),
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
