import { MainTitle } from './Text'

import styles from './Header.module.scss'

export function Header() {
  return (
    <header>
      <a href="/" className={styles.link}>
        <MainTitle />
      </a>
    </header>
  )
}
