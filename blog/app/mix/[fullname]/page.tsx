/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { Mix, Content, excerpt } from "@cmd/posts";

import { Item } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";
import { Code } from "@cmd/ui-text";

import { Preview } from "@cmd/ui-player";
import { Header, Nav } from "@cmd/ui-header";

import * as SiteMetadata from "../../../metadata";
import { Footer } from "../../../components/Footer";
import { components } from "../../../components/MDXComponents";

import * as styles from "./fix.css";

export async function generateStaticParams() {
  const params = Mix.all.map((post) => ({
    fullName: post.id,
  }));

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { fullname: string };
}): Promise<Metadata> {
  const post = Mix.fromId(params.fullname);

  if (!post) {
    throw new Error(`Post not found: ${params.fullname}`);
  }

  const url = `${SiteMetadata.site.url}${SiteMetadata.contentRelativeUrl(
    post
  )}`;
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
  const mix = Mix.fromId(params.fullname);

  if (!mix) {
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
          <Nav.Item as={Link} href="/mixes">
            les mixes
          </Nav.Item>
        </Nav>

        <Item
          key={mix.id}
          post={mix}
          content={<Content post={mix} components={components} />}
        />

        <Footer />

        <span className={styles.nothing} />
      </Layout.Wrapper>

      <Preview />
    </div>
  );
}
