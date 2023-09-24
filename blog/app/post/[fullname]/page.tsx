/* eslint-disable react/no-unescaped-entities */
import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { posts, postFromId, PostContent, excerpt } from "@cmd/posts";

import { Article } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";
import { Code, Paragraph, Small } from "@cmd/ui-text";

import { Preview } from "@cmd/ui-player";

import * as SiteMetadata from "../../../metadata";
import { Footer } from "../../../components/Footer";
import { Header } from "../../../components/Header";
import { components } from "../../../components/MDXComponents";

import * as styles from "./fix.css";

export async function generateStaticParams() {
  const params = posts.map((post) => ({
    fullName: post.id,
  }));

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { fullname: string };
}): Promise<Metadata> {
  const post = postFromId(params.fullname);

  if (!post) {
    throw new Error(`Post not found: ${params.fullname}`);
  }

  const url = `${SiteMetadata.site.url}${SiteMetadata.postUrl(post)}`;
  const imageUrl = `${SiteMetadata.site.url}${post.image.src}`;

  const title = `${post.title} - ${SiteMetadata.site.name}`;
  const description = await excerpt(post);

  return {
    title,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: imageUrl,
    },
  };
}

export default async function Page({
  params,
}: {
  params: { fullname: string };
}) {
  const post = postFromId(params.fullname);

  if (!post) {
    throw new Error(`Post not found: ${params.fullname}`);
  }

  return (
    <div>
      <Layout.Wrapper>
        <Header />

        <Paragraph>
          <Small>
            Le dernier <Code>cmd</Code> c'est <Link href="/">ici</Link> - les{" "}
            <Code>cmd</Code> passés c'est <Link href="/posts">là</Link>
          </Small>
        </Paragraph>

        <Suspense fallback={null}>
          <Article
            post={post}
            content={<PostContent post={post} components={components} />}
          />
        </Suspense>
        <Footer />
        <span className={styles.nothing} />
      </Layout.Wrapper>

      <Preview />
    </div>
  );
}
