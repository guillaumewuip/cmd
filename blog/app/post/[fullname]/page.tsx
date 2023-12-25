/* eslint-disable react/no-unescaped-entities */
import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { Post, Content, excerpt } from "@cmd/posts";

import { Article } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";
import { Code } from "@cmd/ui-text";

import { Preview } from "@cmd/ui-player";
import { Header, Nav } from "@cmd/ui-header";

import * as SiteMetadata from "../../../metadata";
import { Footer } from "../../../components/Footer";
import { components } from "../../../components/MDXComponents";

import * as styles from "./fix.css";

export async function generateStaticParams() {
  const params = Post.all.map((post) => ({
    fullName: post.id,
  }));

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { fullname: string };
}): Promise<Metadata> {
  const post = Post.fromId(params.fullname);

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
  const post = Post.fromId(params.fullname);

  if (!post) {
    throw new Error(`Post not found: ${params.fullname}`);
  }

  return (
    <div>
      <Layout.Wrapper>
        <Header />

        <Nav>
          <Nav.Item as={Link} href="/">
            le dernier <Code>cmd</Code>
          </Nav.Item>
          <Nav.Item as={Link} href="/posts">
            les <Code>cmd</Code> passés
          </Nav.Item>
        </Nav>

        <Suspense fallback={null}>
          <Article
            post={post}
            content={<Content post={post} components={components} />}
          />
        </Suspense>
        <Footer />
        <span className={styles.nothing} />
      </Layout.Wrapper>

      <Preview />
    </div>
  );
}
