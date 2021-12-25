import * as styles from './Default.css'

export function Wrapper({ children }:{ children: React.ReactNode }) {
  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
        {children}
      </div>
    </main>
  )
}

export function SmallSection({ children }:{ children: React.ReactNode }) {
  return (
    <div className={styles.smallSection}>
      {children}
    </div>
  )
}
