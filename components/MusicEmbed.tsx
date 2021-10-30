import classnames from 'classnames'
import { PropsWithChildren, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton';

import styles from './MusicEmbed.module.scss'

function EmptyIframe() {
  return <Skeleton height={60}/>
}

function AsyncIframeWrapper({children}: PropsWithChildren<{}>) {
  const [showIframe, setShowIframe] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowIframe(true)
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [setShowIframe])

  return <>{showIframe ? children : <EmptyIframe />}</>
}

function isBandcampLink(href: string) {
  return href.includes('bandcamp.com/track')
}

async function fetchBandcampTrackId(href: string) {
  const response = await fetch(`/api/bandcamp/track?url=${encodeURIComponent(href)}`)

  const payload = await response.json()

  return payload.trackId
}

function BandcampEmbedLink({ href } : { href: string }) {
  const [trackId, setTrackId] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetchBandcampTrackId(href)
      .then((trackId) => {
        setTrackId(trackId)
      })
      .catch(error => {
        console.error(error)
      })
  }, [setTrackId])

  if (!trackId) {
    return <EmptyIframe />
  }

  return <Bandcamp track={trackId} />
}

export function Bandcamp({
  album,
  track,
}: {
  album?: string,
  track: string,
}) {
  const options = Object.entries({
    album,
    track,
    size: 'large',
    bgcol: 'ffffff',
    linkcol: '0687f5',
    tracklist: 'false',
    artwork: 'small',
    transparent: 'true',
  })
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join('/')

  const src = `https://bandcamp.com/EmbeddedPlayer/${options}/`

  return (
    <span className={styles.container}>
      <AsyncIframeWrapper>
        <iframe
          title="Embed player"
          className={styles.iframe}
          height="120px"
          src={src}
          seamless
        />
      </AsyncIframeWrapper>
    </span>
  )
}

function isSoundcloudLink(href: string) {
  return href.includes('soundcloud.com/')
}

async function fetchSoundcloudTrackId(href: string) {
  const response = await fetch(`/api/soundcloud/track?url=${encodeURIComponent(href)}`)

  const payload = await response.json()

  return payload.trackId
}

function SoundcloudEmbedLink({ href }: { href: string}) {
  const [trackId, setTrackId] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetchSoundcloudTrackId(href)
      .then((trackId) => {
        setTrackId(trackId)
      })
      .catch(error => {
        console.error(error)
      })
  }, [setTrackId])

  if (!trackId) {
    return <EmptyIframe />
  }

  return <Soundcloud track={trackId} />
}

export function Soundcloud({
  track,
}: {
  track: string,
}) {
  const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=false&show_reposts=true&show_teaser=true`

  return (
    <span className={styles.container}>
      <AsyncIframeWrapper>
        <iframe
          title="Embed player"
          className={styles.iframe}
          height="128"
          src={src}
          seamless
        />
      </AsyncIframeWrapper>
    </span>
  )
}

export function Mixcloud({
  feed
}: {
  feed: string
}) {
  const src = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${feed}`;

  return (
    <span className={styles.container}>
      <AsyncIframeWrapper>
        <iframe
          title="Embed player"
          className={styles.iframe}
          height="120"
          src={src}
          seamless
        />
      </AsyncIframeWrapper>
    </span>
  )
}

function isYoutubeLink(href: string) {
  return href.includes('youtube.com/watch')
}

export function Youtube({
  id
}: {
  id: string
}) {
  const src = `https://www.youtube.com/embed/${id}`;

  return (
    <span className={classnames(styles.youtubeWrapper, styles.container)}>
      <AsyncIframeWrapper>
        <iframe
          title="Embed player"
          className={styles.iframe}
          src={src}
          seamless
        />
      </AsyncIframeWrapper>
    </span>
  )
}

function YoutubeEmbedLink({ href } : { href: string}) {
  const result = href.match(/.*v=(?<id>.*)/)

  if (result === null) {
    return null
  }

  const { groups: { id } = { id: undefined } } = result

  if (id === undefined) {
    return null
  }

  return <Youtube id={id} />
}

export function isEmbedableLink(href: string) {
  return isYoutubeLink(href)
    || isBandcampLink(href)
    || isSoundcloudLink(href)
}

export function MusicEmbedLink({ href } : { href: string}) {
  if (isYoutubeLink(href)) {
    return <YoutubeEmbedLink href={href} />
  }

  if (isBandcampLink(href)) {
    return <BandcampEmbedLink href={href} />
  }

  if (isSoundcloudLink(href)) {
    return <SoundcloudEmbedLink href={href} />
  }

  return null
}
