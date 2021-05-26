import NextImage from 'next/image'

import styles from './Article.module.scss'
import { H1, Small } from './Text'

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <article className={styles.article}>
      {children}
    </article>
  )
}

export function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.left}>
      {children}
    </div>
  )
}

export function Image({ src, alt, caption }: { src: string, alt: string, caption?: string }) {
  return (
    <div className={styles.imageSection}>
      <div className={styles.imageContainer}>
        <NextImage src={src} alt={alt} layout="fill" objectFit="cover" />
      </div>
      {caption && <div className={styles.caption}><Small>{caption}</Small></div>}
    </div>
  );
}

export function Metadata({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.metadata}>
      {children}
    </div>
  )
}

export function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.right}>
      {children}
    </div>
  )
}

export function Header({ title, date }: { title: string, date: string }) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <H1>{title}</H1>
      </div>
      <div className={styles.date}>
        <Small>{date}</Small>
      </div>
    </div>
  )
}
