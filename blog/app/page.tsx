/* eslint-disable react/no-unescaped-entities */
import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { lastPost, PostContent } from "@cmd/posts";

import { Article } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";

import { Preview } from "@cmd/ui-player";
import { Code, Paragraph, Small } from "@cmd/ui-text";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { components } from "../components/MDXComponents";

import * as BlogMetadata from "../metadata";

import * as styles from "./fix.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: BlogMetadata.site.name,
    openGraph: {
      type: "website",
      images: lastPost.image.src,
    },
  };
}

export default async function Home() {
  return (
    <Layout.Page>
      <Layout.Wrapper>
        <Header />

        <Paragraph>
          <Small>
            Le dernier <Code>cmd</Code> c'est ici - les <Code>cmd</Code> passés
            c'est <Link href="/posts">là</Link>
          </Small>
        </Paragraph>

        <Suspense fallback={null}>
          <Article
            post={lastPost}
            content={<PostContent post={lastPost} components={components} />}
          />
        </Suspense>

        <Paragraph centered>
          Ça vous a plu? Retrouvez tous les <Code>cmd</Code> passés{" "}
          <Link href="/posts">par ici.</Link>
        </Paragraph>

        <Footer />
        <span className={styles.fix} />
      </Layout.Wrapper>

      <Preview />
    </Layout.Page>
  );
}
