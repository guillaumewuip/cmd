/* eslint-disable react/no-unescaped-entities */
import React from "react";

import { posts } from "@cmd/posts";
import { Mosaic } from "@cmd/ui-article";
import { H2, Code, Paragraph, Small } from "@cmd/ui-text";

import * as Layout from "@cmd/ui-layout";

import { Preview } from "@cmd/ui-player";

import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

import * as BlogMetadata from "../../metadata";

import * as styles from "./fix.css";

export default async function Page() {
  const cmds = posts.map((post) => ({
    image: post.image,
    relativeUrl: BlogMetadata.postUrl(post),
    title: post.title,
    id: post.id,
  }));

  return (
    <div>
      <Layout.Wrapper>
        <Header />

        <Paragraph>
          <Small>
            Le dernier <Code>cmd</Code> c'est <Link href="/">ici</Link>
          </Small>
        </Paragraph>

        <H2>
          Tous les <Code>cmd</Code> passées listées bien comme il faut ici même
          :
        </H2>

        <Mosaic posts={cmds} />

        <Footer />

        <span className={styles.nothing} />
      </Layout.Wrapper>

      <Preview />
    </div>
  );
}
