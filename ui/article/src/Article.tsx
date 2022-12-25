import { ReactNode } from "react";
import NextImage from "next/image";

import { H1, Small } from "@cmd/ui-text";
import { Metadata } from "@cmd/domain-post";

import * as styles from "./Article.css";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <article className={styles.article}>{children}</article>;
}

function Column({ children }: { children: React.ReactNode }) {
  return <div className={styles.left}>{children}</div>;
}

function Image({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <div className={styles.imageSection}>
      <div className={styles.imageContainer}>
        <NextImage
          className={styles.nextImage}
          src={src}
          alt={alt}
          width={600}
          height={600}
          priority
        />
      </div>
      {caption && (
        <div className={styles.caption}>
          <Small>{caption}</Small>
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
  metadata,
  createdAt,
  content,
}: {
  metadata: Metadata.Cmd;
  createdAt: string;
  content: ReactNode;
}) {
  return (
    <Wrapper>
      <Title>
        <H1>{metadata.title}</H1>
      </Title>

      <Column>
        <Image
          src={metadata.image.src}
          alt={metadata.image.alt}
          caption={metadata.image.caption}
        />
      </Column>

      <Content>
        {content}

        <div className={styles.metadata}>
          <Small>Publié le {createdAt}</Small>
        </div>
      </Content>
    </Wrapper>
  );
}
