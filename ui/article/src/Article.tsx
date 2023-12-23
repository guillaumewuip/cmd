import { ReactNode } from "react";
import NextImage from "next/image";

import { H1, Small } from "@cmd/ui-text";
import { Post } from "@cmd/domain-content";

import { format, parseISO } from "date-fns";

import * as styles from "./Article.css";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <article className={styles.article}>{children}</article>;
}

function Column({ children }: { children: React.ReactNode }) {
  return <div className={styles.left}>{children}</div>;
}

function Image({ image }: { image: Post.Image }) {
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

function Content({ children }: { children: React.ReactNode }) {
  return <div className={styles.right}>{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <div className={styles.title}>{children}</div>;
}

export function Article({
  post,
  content,
}: {
  post: Post.Post;
  content: ReactNode;
}) {
  const publicationDate = format(parseISO(post.publishedAt), "dd/MM/yyyy");

  return (
    <Wrapper>
      <Title>
        <H1>{post.title}</H1>
      </Title>

      <Column>
        <Image image={post.image} />
      </Column>

      <Content>
        {content}

        <div className={styles.metadata}>
          <Small>Publié le {publicationDate}</Small>
        </div>
      </Content>
    </Wrapper>
  );
}
