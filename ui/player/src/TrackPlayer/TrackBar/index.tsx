import {
  Track,
  playOrPause,
  play,
  usePlayer,
  Tracks,
  shallowEqual,
} from "@cmd/domain-player";

import * as Eq from "fp-ts/Eq";
import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import * as styles from "./TrackBar.css";

import TrackThumbnail from "../../components/Thumbnail";
import SourceLink from "../../components/SourceLink";
import Progress from "../../components/Progress";
import * as Button from "../../components/Button";
import TrackText from "../../components/TrackText";

import Aborted from "../Aborted";

const eqOptionTrack = pipe(shallowEqual, Eq.fromEquals, Option.getEq);

function Title({ track }: { track: Track.Track }) {
  return (
    <div className={styles.title}>
      <TrackText track={track} />
    </div>
  );
}

function Source({ track }: { track: Track.Track }) {
  return (
    <div className={styles.source}>
      {Track.isInitialized(track) && <SourceLink source={track.source} />}
    </div>
  );
}

function Thumbnail({ track }: { track: Track.Track }) {
  return (
    <div className={styles.thumbnail}>
      <TrackThumbnail source={track.source} />
    </div>
  );
}

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
        <Thumbnail track={track} />

        <div className={styles.command}>
          {!Track.isInitialized(track) && <Button.Loading />}
          {Track.isInitialized(track) && (
            <Button.Play onClick={play(track)} trackName={track.title} />
          )}
        </div>

        <Title track={track} />

        <Source track={track} />
      </div>
    );
  }

  return (
    <div className={styles.selectedBar}>
      <Thumbnail track={track} />

      <div className={styles.command}>
        {!Track.isInteractive(track) && <Button.Loading />}
        {Track.isInteractive(track) &&
          (Track.isPlaying(track) ? (
            <Button.Pause onClick={playOrPause} trackName={track.title} />
          ) : (
            <Button.Play onClick={playOrPause} trackName={track.title} />
          ))}
      </div>

      <Title track={track} />

      <div className={styles.progress}>
        <Progress track={track} />
      </div>

      <Source track={track} />
    </div>
  );
}
