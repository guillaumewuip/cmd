import * as React from "react";
import NextImage from "next/image";
import { Mix } from "@cmd/domain-content";
import { Small } from "@cmd/ui-text";
import { format, parseISO } from "date-fns";
import * as styles from "./Item.css";

export function Item({
  post,
  content,
}: {
  post: Mix.Mix;
  content: React.ReactNode;
}) {
  const publicationDate = format(parseISO(post.publishedAt), "dd/MM/yyyy");

  return (
    <article className={styles.grid}>
      <div className={styles.image}>
        <NextImage
          className={styles.nextImage}
          src={post.image.src}
          alt={post.image.alt}
          width={600}
          height={600}
        />
      </div>
      <div className={styles.content}>
        <h2>{post.title}</h2>

        {content}

        <Small>Publié le {publicationDate}</Small>
      </div>
      <div className={styles.action}>
        <a
          className={styles.button}
          href={post.externalUrl}
          target="_blank"
          rel="noreferrer"
        >
          Écouter ↗
        </a>
      </div>
    </article>
  );
}
