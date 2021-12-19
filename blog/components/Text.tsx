import * as MusicEmbed from './MusicEmbed'

import styles from './Text.module.scss'

export function Link({ href, children } : { href: string, children: string }) {
  if (href === children && MusicEmbed.isEmbedableLink(href)) {
    return <MusicEmbed.MusicEmbedLink href={href} />
  }

  return <a className={styles.a} href={href}>{children}</a>
}
