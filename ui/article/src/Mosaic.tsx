import NextImage from "next/image";

import * as ReadonlyArrayFP from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";

import { Metadata } from "@cmd/domain-post";
import { Paragraph } from "@cmd/ui-text";

import * as styles from "./Mosaic.css";

function Article({ href, metadata }: { href: string; metadata: Metadata.Cmd }) {
  return (
    <a className={styles.article} href={href}>
      <NextImage
        src={metadata.image.src}
        alt={metadata.image.alt}
        layout="fill"
        objectFit="cover"
      />
      <div className={styles.overlay} />
      <div className={styles.title}>
        <Paragraph inverted noMargin>
          <strong>{metadata.title}</strong>
        </Paragraph>
      </div>
    </a>
  );
}

export function Mosaic({
  posts,
}: {
  posts: ReadonlyArray<{ metadata: Metadata.Cmd; href: string }>;
}) {
  return (
    <div className={styles.grid}>
      {pipe(
        posts,
        ReadonlyArrayFP.map((post) => <Article key={post.href} {...post} />)
      )}
    </div>
  );
}
