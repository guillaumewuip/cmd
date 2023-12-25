/* eslint-disable react/no-unescaped-entities */
import React from "react";

import { Post } from "@cmd/posts";
import { Mosaic } from "@cmd/ui-article";
import { H2, Code } from "@cmd/ui-text";

import * as Layout from "@cmd/ui-layout";

import { Preview } from "@cmd/ui-player";

import Link from "next/link";
import { Header, Nav } from "@cmd/ui-header";
import { Footer } from "../../components/Footer";

import * as BlogMetadata from "../../metadata";

import * as styles from "./fix.css";

export default async function Page() {
  const cmds = Post.all.map((post) => ({
    image: post.image,
    relativeUrl: BlogMetadata.postUrl(post),
    title: post.title,
    id: post.id,
  }));

  return (
    <div>
      <Layout.Wrapper>
        <Header />

        <Nav>
          <Nav.Item as={Link} href="/">
            le dernier <Code>cmd</Code>
          </Nav.Item>
          <Nav.Item active as={Link} href="/posts">
            les <Code>cmd</Code> passés
          </Nav.Item>
        </Nav>

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
