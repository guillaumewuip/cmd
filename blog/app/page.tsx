/* eslint-disable react/no-unescaped-entities */
import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { Post, Content } from "@cmd/posts";

import { Article } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";

import { Preview } from "@cmd/ui-player";
import { Code, Paragraph } from "@cmd/ui-text";
import { Header, Nav } from "@cmd/ui-header";
import { Footer } from "../components/Footer";

import { components } from "../components/MDXComponents";

import * as BlogMetadata from "../metadata";

import * as styles from "./fix.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: BlogMetadata.site.name,
    openGraph: {
      type: "website",
      images: Post.last.image.src,
    },
  };
}

export default async function Home() {
  return (
    <Layout.Page>
      <Layout.Wrapper>
        <Header />

        <Nav>
          <Nav.Item active>
            le dernier <Code>cmd</Code>
          </Nav.Item>
          <Nav.Item as={Link} href="/posts">
            les <Code>cmd</Code> passés
          </Nav.Item>
          <Nav.Item as={Link} href="/mixes">
            les mixes
          </Nav.Item>
        </Nav>

        <Suspense fallback={null}>
          <Article
            post={Post.last}
            content={<Content post={Post.last} components={components} />}
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
