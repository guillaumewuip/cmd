import { ReactNode } from "react";
import NextImage from "next/image";

import { H1, Small } from "@cmd/ui-text";
import { Post } from "@cmd/domain-post";

import { format, parseISO } from "date-fns";

import * as styles from "./Article.css";

export function Image({ post }: { post: Post.Post }) {
  const { image } = post;

  return (
    <div className={styles.imageSection}>
      <div className={styles.imageContainer}>
        <NextImage
          className={styles.nextImage}
          src={image.src}
          alt={image.alt}
          width={600}
          height={600}
          priority
        />
      </div>
      {image.caption && (
        <div className={styles.caption}>
          <Small>{image.caption}</Small>
        </div>
      )}
    </div>
  );
}

export function Text({
  post,
  content,
}: {
  post: Post.Post;
  content: ReactNode;
}) {
  const publicationDate = format(parseISO(post.publishedAt), "dd/MM/yyyy");

  return (
    <div className={styles.text}>
      <H1>{post.title}</H1>

      {content}

      <div className={styles.metadata}>
        <Small>Publié le {publicationDate}</Small>
      </div>
    </div>
  );
}
