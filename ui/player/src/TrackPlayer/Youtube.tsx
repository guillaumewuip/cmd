import { useRef  } from 'react'

import {
  loadYoutube,
  Track,
} from '@cmd/domain-player'

import { VisuallyAndAriaHidden } from '../components/Hidden'
import * as TrackBar from './TrackBar'

export function Player({
  trackId,
}: {
  trackId: string
}) {
  const ref = useRef(null)

  const loadSource = (track: Track.Reserved) => {
    if (ref.current === null) {
      throw new Error('Ref is empty')
    }

    return loadYoutube({
      track,
      container: ref.current,
    })
  }

  return (
    <div id={trackId}>
      <VisuallyAndAriaHidden>
        <div ref={ref} tabIndex={-1} />
      </VisuallyAndAriaHidden>

      <TrackBar.Player id={trackId} loadSource={loadSource} />
    </div>
  )
}

