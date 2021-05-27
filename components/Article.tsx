import { ReactNode } from 'react'
import NextImage from 'next/image'

import * as PostMetadata from '../lib/postMetadata'

import styles from './Article.module.scss'
import { H1, Small } from './Text'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <article className={styles.article}>
      {children}
    </article>
  )
}

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.left}>
      {children}
    </div>
  )
}

function Image({ src, alt, caption }: { src: string, alt: string, caption?: string }) {
  return (
    <div className={styles.imageSection}>
      <div className={styles.imageContainer}>
        <NextImage src={src} alt={alt} layout="fill" objectFit="cover" />
      </div>
      {caption && <div className={styles.caption}><Small>{caption}</Small></div>}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.right}>
      {children}
    </div>
  )
}

function Header({ title, date }: { title: string, date: string }) {
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

export function Article({
  metadata,
  createdAt,
  content,
}: {
  metadata: PostMetadata.PostMetadata,
  createdAt: string,
  content: ReactNode,
}) {
  return (
    <Wrapper>
      <Column>
        <Image src={metadata.image.src} alt={metadata.image.alt} caption={metadata.image.caption} />
      </Column>

      <Content>
        <Header title={metadata.title} date={createdAt} />
          {content}
      </Content>
    </Wrapper>
  )
}
