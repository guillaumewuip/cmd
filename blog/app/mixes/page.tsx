/* eslint-disable react/no-unescaped-entities */
import React from "react";

import { Mix, Content } from "@cmd/posts";
import { Item } from "@cmd/ui-article";
import { H2, Paragraph, Code } from "@cmd/ui-text";

import * as Layout from "@cmd/ui-layout";

import { Preview } from "@cmd/ui-player";

import Link from "next/link";
import { Header, Nav } from "@cmd/ui-header";
import { Footer } from "../../components/Footer";
import { components } from "../../components/MDXComponents";

import * as BlogMetadata from "../../metadata";

import * as styles from "./fix.css";

export const metadata = {
  title: `Tous les mixes - ${BlogMetadata.site.name}`,
};

export default async function Page() {
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
          <Nav.Item active as={Link} href="/mixes">
            les mixes
          </Nav.Item>
        </Nav>

        <H2>
          <Code>cmd</Code> mixes
        </H2>

        <Paragraph>
          Quelques mixes fait à droite à gauche, dans la pure tradition{" "}
          <Code>cmd</Code> bien entendu.
        </Paragraph>

        {Mix.all.map((mix) => (
          <Item
            key={mix.id}
            post={mix}
            content={<Content post={mix} components={components} />}
          />
        ))}

        <Footer />

        <span className={styles.nothing} />
      </Layout.Wrapper>

      <Preview />
    </div>
  );
}
