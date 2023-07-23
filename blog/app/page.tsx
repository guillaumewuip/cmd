/* eslint-disable react/no-unescaped-entities */
import React from "react";
import type { Metadata } from "next";

import { posts, lastPost, PostContent } from "@cmd/posts";

import { Article, Mosaic } from "@cmd/ui-article";
import Layout from "@cmd/ui-layout";
import { Paragraph, Code, H2, Link, Hr } from "@cmd/ui-text";
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

        <Layout.Content>
          <Layout.Content.Main>
            <Article
              post={lastPost}
              content={<PostContent post={lastPost} components={components} />}
            />
          </Layout.Content.Main>

          <Layout.Content.Nav>
            <H2>
              Toutes les <Code>cmd</Code> passées listées bien comme il faut ici
              même :
            </H2>

            <Mosaic posts={cmds} />
          </Layout.Content.Nav>

          <Layout.Content.Footer>
            <Footer />
          </Layout.Content.Footer>
        </Layout.Content>

        <Layout.Player>
          <Preview />
        </Layout.Player>
        <span className={styles.fix} />
      </>
    </Layout>
  );
}
