import NextImage from "next/image";

import * as ReadonlyArrayFP from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";

import { Post } from "@cmd/domain-content";
import { Paragraph } from "@cmd/ui-text";

import * as styles from "./Mosaic.css";

type PostMetadata = {
  image: Post.Image;
  relativeUrl: string;
  title: string;
  id: string;
};

function Article({ post }: { post: PostMetadata }) {
  return (
    <a className={styles.article} href={post.relativeUrl}>
      <NextImage
        className={styles.nextImage}
        src={post.image.src}
        alt={post.image.alt}
        width={600}
        height={600}
      />
      <div className={styles.overlay} />
      <div className={styles.title}>
        <Paragraph inverted noMargin>
          <strong>{post.title}</strong>
        </Paragraph>
      </div>
    </a>
  );
}

export function Mosaic({ posts }: { posts: PostMetadata[] }) {
  return (
    <div className={styles.grid}>
      {pipe(
        posts,
        ReadonlyArrayFP.map((post) => <Article key={post.id} post={post} />)
      )}
    </div>
  );
}
