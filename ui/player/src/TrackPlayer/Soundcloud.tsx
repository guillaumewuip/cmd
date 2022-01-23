import { useState, useEffect, useRef } from 'react'

import {
  loadSoundcloud,
  Track,
} from '@cmd/domain-player'

import { VisuallyAndAriaHidden } from '../components/Hidden'
import * as TrackBar from './TrackBar'

function LocalPlayer({
  id,
}: {
  id: string
}) {
  const ref = useRef(null)

  const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${id}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=false&show_reposts=true&show_teaser=true`

  const loadSource = (track: Track.Reserved) => {
    if (ref.current === null) {
      throw new Error('Soundcloud ref is empty')
    }

    return loadSoundcloud({
      track,
      iframe: ref.current,
    })
  }

  return (
    <div id={id}>
      <VisuallyAndAriaHidden>
        <iframe
          ref={ref}
          title="Embed player"
          height="128"
          src={src}
          allow="autoplay"
          tabIndex={-1}
          seamless
        />
      </VisuallyAndAriaHidden>

      <TrackBar.Player id={id} loadSource={loadSource} />
    </div>
  )
}

async function fetchSoundcloudTrackId(href: string): Promise<string> {
  const response = await fetch(`https://cmd-apis.vercel.app/api/soundcloud/track?url=${encodeURIComponent(href)}`)

  const payload = await response.json()

  return payload.trackId
}

export function Player({ href }: { href: string }) {
  const [trackId, setTrackId] = useState<string | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    fetchSoundcloudTrackId(href)
      .then((trackId) => {
        setTrackId(trackId)
      })
      .catch(error => {
        setError(error)
        console.error(error)
      })
  }, [setTrackId, setError])

  if (error) {
    return <TrackBar.Aborted />
  }

  if (!trackId) {
    return <TrackBar.Loading />
  }

  return <LocalPlayer id={trackId} />
}
