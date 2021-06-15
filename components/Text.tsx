import classnames from 'classnames'

import styles from './Text.module.scss'

export function Paragraph({
  children,
  centered,
  inverted,
  noMargin,
} : {
  children: React.ReactNode,
  centered?: boolean,
  inverted?: boolean,
  noMargin?: boolean
}) {
  return (
    <p className={classnames(
      styles.paragraph,
      {
        [styles.centered]: centered,
        [styles.inverted]: inverted,
        [styles.noMargin]: noMargin,
      }
    )}>
      {children}
    </p>
  )
}

export function Small({ children } : { children: React.ReactNode }) {
  return <p className={styles.small}>{children}</p>
}

export function MainTitle({ children } : { children: string }) {
  return <h1 className={styles.mainTitle}>{children}</h1>
}

export function Link({ href, children } : { href: string, children: string }) {
  return <a className={styles.a} href={href}>{children}</a>
}

export function H1({ children } : { children: React.ReactNode }) {
  return <h1 className={styles.h1}>{children}</h1>
}

export function H2({ children } : { children: React.ReactNode }) {
  return <h2 className={styles.h2}>{children}</h2>
}

export function Code({ children } : { children: React.ReactNode }) {
  return <code className={styles.code}>{children}</code>
}
