import { useState, useEffect } from 'react'

import {
  loadBandcamp,
  Track,
} from '@cmd/domain-player'

import * as TrackBar from './TrackBar'

function LocalPlayer({
  id,
  streamUrl,
}: {
  id: string,
  streamUrl: string
}) {
  const loadSource = (track: Track.Reserved) => loadBandcamp({
    track,
    streamUrl,
  })

  return (
    <div id={id}>
      <TrackBar.Player id={id} loadSource={loadSource} />
    </div>
  )
}

type BandcampData = {
  trackId: string,
  streamUrl: string,
}

async function fetchBandcampData(href: string): Promise<BandcampData> {
  const response = await fetch(`/api/bandcamp/track?url=${encodeURIComponent(href)}`)

  const payload = await response.json()

  return {
    trackId: payload.trackId,
    streamUrl: payload.streamUrl,
  }
}

export function Player({ href }: { href: string }) {
  const [data, setData] = useState<BandcampData | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    fetchBandcampData(href)
      .then((data) => {
        setData(data)
      })
      .catch(error => {
        console.error(error)
        setError(error)
      })
  }, [setData, setError])

  if (error) {
    return <TrackBar.Aborted />
  }

  if (!data) {
    return <TrackBar.Loading />
  }

  return <LocalPlayer id={data.trackId} streamUrl={data.streamUrl} />
}
