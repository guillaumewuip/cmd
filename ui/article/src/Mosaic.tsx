import NextImage from 'next/image'

import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function'

import { Infos } from '@cmd/domain-post'
import { Paragraph } from '@cmd/ui-text'

import * as styles from './Mosaic.css'

function Article({
  post
}: {
  post: Infos.Infos
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
  posts: ReadonlyArray<Infos.Infos>
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
