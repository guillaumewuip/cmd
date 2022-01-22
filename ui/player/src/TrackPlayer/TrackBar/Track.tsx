import {
  Track,
  playOrPause,
  play,
} from '@cmd/domain-player'

import * as styles from './TrackBar.css'

import Progress from '../../components/Progress'
import * as Button from  '../../components/Button'
import TrackText from  '../../components/TrackText'

import Aborted from './Aborted'
import Loading from './Loading'

export default function TrackBar({
  track,
  isSelected,
}: {
  track: Track.Track,
  isSelected: boolean
}) {
  if (!Track.isInitialized(track)) {
    return <Loading />
  }

  if (Track.isAborted(track)) {
    return <Aborted />
  }

  if (!isSelected) {
    return (
      <div className={styles.notSelectedBar}>
        <div className={styles.command}>
          <Button.Play onClick={play(track)} trackName={Track.title(track)} />
        </div>

        <div className={styles.title}>
          <TrackText track={track} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.selectedBar}>
      <div className={styles.command}>
        {
          Track.isInteractive(track)
          ? Track.isPlaying(track)
            ? <Button.Pause onClick={playOrPause} trackName={Track.title(track)} />
            : <Button.Play onClick={playOrPause} trackName={Track.title(track)} />
          : <Button.Loading />
        }
      </div>

      <div className={styles.title}>
        <TrackText track={track} />
      </div>

      <div className={styles.progress}>
        <Progress track={track} />
      </div>
    </div>
  )
}
