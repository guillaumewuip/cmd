import NextImage from 'next/image'

import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function'

import * as Posts from '../lib/posts'

import { Paragraph } from '../components/Text'

import styles from './ArticleMosaic.module.scss'

function Article({
  post
}: {
  post: Posts.PostInfos
}) {
  return (
    <a className={styles.article} href={`/post/${post.fullName}`}>
      <NextImage src={post.metadata.image.src} alt={post.metadata.image.alt} layout="fill" objectFit="cover" />
      <div className={styles.overlay} />
      <div className={styles.title}>
        <Paragraph inverted noMargin>
          <strong>{post.metadata.title}</strong>
        </Paragraph>
      </div>
    </a>
  )
}

export function Mosaic({
  posts,
}: {
  posts: ReadonlyArray<Posts.PostInfos>
}) {
  return (
    <div className={styles.grid}>
      {pipe(
        posts,
        ReadonlyArrayFP.map(post => <Article key={post.fullName} post={post} />)
      )}
    </div>
  )
}
