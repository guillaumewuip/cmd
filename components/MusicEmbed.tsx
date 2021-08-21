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


export function Bandcamp({
  album,
  track,
}: {
  album: string,
  track?: string,
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
    <div className={styles.container}>
      <AsyncIframeWrapper>
        <iframe
          title="Embed player"
          className={styles.iframe}
          height="120px"
          src={src}
          seamless
        />
      </AsyncIframeWrapper>
    </div>
  )
}

export function Soundcloud({
  track,
}: {
  track: string,
}) {
  const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=false&show_reposts=true&show_teaser=true`

  return (
    <div className={styles.container}>
      <AsyncIframeWrapper>
        <iframe
          title="Embed player"
          className={styles.iframe}
          height="128"
          src={src}
          seamless
        />
      </AsyncIframeWrapper>
    </div>
  )
}

export function Mixcloud({
  feed
}: {
  feed: string
}) {
  const src = `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${feed}`;

  return (
    <div className={styles.container}>
      <AsyncIframeWrapper>
        <iframe
          title="Embed player"
          className={styles.iframe}
          height="120"
          src={src}
          seamless
        />
      </AsyncIframeWrapper>
    </div>
  )
}

export function Youtube({
  id
}: {
  id: string
}) {
  const src = `https://www.youtube.com/embed/${id}`;

  return (
    <div className={classnames(styles.youtubeWrapper, styles.container)}>
      <AsyncIframeWrapper>
        <iframe
          title="Embed player"
          className={styles.iframe}
          src={src}
          seamless
        />
      </AsyncIframeWrapper>
    </div>
  )
}
