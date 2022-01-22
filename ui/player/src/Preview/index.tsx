import * as Option from 'fp-ts/Option'
import { pipe } from 'fp-ts/function';

import {
  usePlayer,
  Tracks,
  Track,
  playOrPause,
  play,
  saveAutoplayChoice,
} from '@cmd/domain-player'

import {
  Small
} from '@cmd/ui-text'

import * as Button from '../components/Button'
import Progress from '../components/Progress'
import TrackText from '../components/TrackText';
import AbortedText from '../components/AbortedText';

import * as styles from './Preview.css'

export function NextTrack({ track } : { track: Track.Initialized }) {
  return (
    <Button.Next onClick={play(track)} trackName={Track.title(track)} />
  )
}

export function Preview() {
  const state = usePlayer()

  if (Tracks.isEmpty(state)) {
    return null
  }

  const autoplayEnabled = Tracks.autoplayEnabled(state)

  const selectedTrack = Tracks.selectedTrack(state)

  const nextTrack = pipe(
    state,
    Tracks.nextTrack
  )

  if (!Track.isInitialized(selectedTrack) || Track.isAborted(selectedTrack)) {
    return (
      <div className={`${styles.preview} ${!Tracks.alreadyPlayed(state) && styles.hidden}`}>
        <div className={styles.currentTrack}>
          <TrackText track={selectedTrack} />
        </div>
        {!Track.isInitialized(selectedTrack) && (
          <div className={styles.player}>
            <div className={styles.commandBar}>
              <div className={styles.commandPlayPause}>
                <Button.Loading size="medium" />
              </div>
              <div className={styles.commandNext}>
                {Option.isSome(nextTrack) && Track.isInitialized(nextTrack.value) && <NextTrack track={nextTrack.value} />}
              </div>
            </div>
            <div className={styles.progress}>
            </div>
          </div>
        )}
        {Track.isAborted(selectedTrack) && (
          <div className={styles.aborted}>
            <AbortedText />
            {Option.isSome(nextTrack) && Track.isInitialized(nextTrack.value) && <NextTrack track={nextTrack.value} />}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${styles.preview} ${!Tracks.alreadyPlayed(state) && styles.hidden}`}>
      <div className={styles.currentTrack}>
        <TrackText track={selectedTrack} />
      </div>
      <div className={styles.player}>
        <div className={styles.commandBar}>
          <div className={styles.commandPlayPause}>
            {
              Track.isInteractive(selectedTrack)
              ? Track.isPlaying(selectedTrack)
                ? <Button.Pause size="medium" trackName={Track.title(selectedTrack)} onClick={playOrPause} />
                : <Button.Play size="medium" trackName={Track.title(selectedTrack)} onClick={playOrPause} />
              : <Button.Loading size="medium" />
            }
          </div>
          <div className={styles.commandNext}>
            {Option.isSome(nextTrack) && Track.isInitialized(nextTrack.value) && <NextTrack track={nextTrack.value} />}
          </div>
        </div>
        <div className={styles.progress}>
          <Progress track={selectedTrack} />
        </div>
      </div>
      <div className={styles.autoPlay}>
        <div className={styles.autoPlayLabel} aria-hidden>
          <Small>{autoplayEnabled ? 'Lecture auto activée' : 'Lecture auto désactivée'}</Small>
        </div>
        <div className={styles.autoPlayButton}>
          <Button.AutoPlay status={autoplayEnabled ? 'on' : 'off'} onClick={saveAutoplayChoice(!autoplayEnabled)} />
        </div>
      </div>
    </div>
  )
}

