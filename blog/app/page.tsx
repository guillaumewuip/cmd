import React from "react";
import type { Metadata } from "next";

import { posts, lastPost, PostContent } from "@cmd/posts";

import { Article, Mosaic } from "@cmd/ui-article";
import Layout from "@cmd/ui-layout";
import { ColumnHeader } from "@cmd/ui-text";
import { generateFeeds } from "@cmd/domain-rss";

import { Preview } from "@cmd/ui-player";
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
  await generateFeeds({
    siteBaseURL: BlogMetadata.site.url,
    postRelativeURL: BlogMetadata.postUrl,
    outputDir: "./public/rss",
  });

  const cmds = posts.map((post) => ({
    image: post.image,
    relativeUrl: BlogMetadata.postUrl(post),
    title: post.title,
    id: post.id,
  }));

  return (
    <Layout>
      <>
        <Layout.Header>
          <Header />
        </Layout.Header>

        <Layout.Illustration.Header>
          <ColumnHeader>la photo</ColumnHeader>
        </Layout.Illustration.Header>
        <Layout.Illustration.Content>
          <Article.Image post={lastPost} />
        </Layout.Illustration.Content>

        <Layout.Main.Header>
          <ColumnHeader>le cmd</ColumnHeader>
        </Layout.Main.Header>
        <Layout.Main.Content>
          <Article.Text
            post={lastPost}
            content={<PostContent post={lastPost} components={components} />}
          />
          <Footer />
        </Layout.Main.Content>

        <Layout.Nav>
          <Mosaic posts={cmds} />
        </Layout.Nav>

        <Layout.Player>
          <Preview />
        </Layout.Player>

        <span className={styles.fix} />
      </>
    </Layout>
  );
}
