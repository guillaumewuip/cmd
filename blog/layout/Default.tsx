import styles from './Default.module.scss'

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