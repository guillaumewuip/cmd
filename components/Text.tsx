import styles from './Text.module.scss'

export function Paragraph({ children } : { children: React.ReactNode }) {
  return <p className={styles.paragraph}>{children}</p>
}

export function MainTitle({ children } : { children: string }) {
  return <h1 className={styles.mainTitle}>{children}</h1>
}

export function Link({ href, children } : { href: string, children: string }) {
  return <a className={styles.a} href={href}>{children}</a>
}


export function H1({ children } : { children: string }) {
  return <h1 className={styles.h1}>{children}</h1>
}

export function H2({ children } : { children: string }) {
  return <h2 className={styles.h2}>{children}</h2>
}

