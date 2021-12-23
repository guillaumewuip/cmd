import { MainTitle } from './Text'

import * as styles from './Header.css'

export function Header() {
  return (
    <header>
      <a href="/" className={styles.link}>
        <MainTitle />
      </a>
    </header>
  )
}
