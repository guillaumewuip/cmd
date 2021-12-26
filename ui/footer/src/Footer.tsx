import { Link, Small } from '@cmd/ui-text'

import * as styles from './Footer.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Small>
        <Link href="/">cerfeuil et musique douce</Link> - <Link href="/rss/feed.xml">RSS</Link> - <Link href="http://guillaume.wuips.com">Contact</Link> - <Link href="https://github.com/guillaumewuip/cmd">Github</Link>
      </Small>

      <script data-goatcounter="https://cmd-wuips.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
    </footer>
  )
}
