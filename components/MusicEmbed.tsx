import classnames from 'classnames'

import styles from './MusicEmbed.module.scss'

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
    .map(([key, value]) => `${key}=${value}`)
    .join('/')

  const src = `https://bandcamp.com/EmbeddedPlayer/${options}/`

  return (
    <div className={styles.container}>
      <iframe
        className={styles.iframe}
        height="120px"
        src={src}
        seamless
      />
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
      <iframe
        className={styles.iframe}
        height="128"
        src={src}
        seamless
      />
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
      <iframe
        className={styles.iframe}
        height="120"
        src={src}
        seamless
      />
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
      <iframe
        className={styles.iframe}
        src={src}
        seamless
      />
    </div>
  )
}
