import { Link, Paragraph, Small } from './Text'

import styles from './Footer.module.scss'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Paragraph>
        <Small>
          <Link href="/">cerfeuil et musique douce</Link> - <Link href="/rss/feed.xml">RSS</Link> - <Link href="http://guillaume.wuips.com">Contact</Link>
        </Small>
      </Paragraph>
    </footer>
  )
}
