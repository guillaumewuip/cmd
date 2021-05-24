import NextImage from 'next/image'

import styles from './Article.module.scss'

export function Image({ src, alt, caption }: { src: string, alt: string, caption?: string }) {
  return (
    <div className={styles.left}>
      <div className={styles.imageContainer}>
        <NextImage src={src} alt={alt} layout="fill" objectFit="cover" />
      </div>
    </div>
  );
}

export function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.right}>
      {children}
    </div>
  )
}

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <article className={styles.article}>
      {children}
    </article>
  )
}
