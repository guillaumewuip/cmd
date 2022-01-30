import {
  Tracks,
  Track,
  playOrPause,
  play,
  usePlayer,
  shallowEqual,
} from "@cmd/domain-player";

import * as Eq from "fp-ts/Eq";
import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import * as styles from "./TrackBar.css";

import Progress from "../../components/Progress";
import * as Button from "../../components/Button";
import TrackText from "../../components/TrackText";

import Aborted from "./Aborted";

const eqOptionTrack = pipe(shallowEqual, Eq.fromEquals, Option.getEq);

export default function TrackBar({ id }: { id: string }) {
  const maybeTrack = usePlayer(Tracks.findTrackById(id), eqOptionTrack.equals);
  const selected = usePlayer(Tracks.isSelected(id));

  if (Option.isNone(maybeTrack)) {
    return null;
  }

  const track = maybeTrack.value;

  if (Track.isAborted(track)) {
    return <Aborted />;
  }

  if (!selected || Track.isReserved(track)) {
    return (
      <div className={styles.notSelectedBar}>
        <div className={styles.command}>
          {!Track.isInitialized(track) && <Button.Loading />}
          {Track.isInitialized(track) && (
            <Button.Play onClick={play(track)} trackName={Track.title(track)} />
          )}
        </div>

        <div className={styles.title}>
          <TrackText track={track} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.selectedBar}>
      <div className={styles.command}>
        {!Track.isInteractive(track) && <Button.Loading />}
        {Track.isInteractive(track) &&
          (Track.isPlaying(track) ? (
            <Button.Pause
              onClick={playOrPause}
              trackName={Track.title(track)}
            />
          ) : (
            <Button.Play onClick={playOrPause} trackName={Track.title(track)} />
          ))}
      </div>

      <div className={styles.title}>
        <TrackText track={track} />
      </div>

      <div className={styles.progress}>
        <Progress track={track} />
      </div>
    </div>
  );
}
