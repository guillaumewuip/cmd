/* eslint-disable react/no-unescaped-entities */
import React from "react";
import type { Metadata } from "next";

import { posts, lastPost, PostContent } from "@cmd/posts";

import { Article, Mosaic } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";
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
    <Layout.Page>
      <Layout.Wrapper>
        <Layout.SmallSection>
          <Header />
          <Paragraph>
            Hello ! Et bienvenue sur cerfeuil et musique douce a.k.a.{" "}
            <Code>cmd</Code> pour les intimes. Ici je partage régulièrement la
            bonne musique que je découvre au quotidien sur les internets et
            ailleurs (et oui, parfois en vrai avec de vrais gens et de vrais
            sons, c'est incroyable).
          </Paragraph>

          <Paragraph>
            On y trouve principalement de l'électro, de l'ambient, de la techno,
            de l'experimental mais aussi du funk, de la synth-pop, de la disco,
            du rock, etc. Bref, un peu toute musique chouette dénichée à droite
            à gauche. À déguster avec une bonne part de{" "}
            <Link href="https://www.instagram.com/mmpsev/">
              tarte au cerfeuil
            </Link>{" "}
            (d'où le nom).
          </Paragraph>

          <Paragraph>
            Sans plus attendre, la dernière <Code>cmd</Code>, vous m'en direz
            des nouvelles :
          </Paragraph>
        </Layout.SmallSection>

        <Article
          post={lastPost}
          content={<PostContent post={lastPost} components={components} />}
        />

        <Layout.SmallSection>
          <H2>
            Toutes les <Code>cmd</Code> passées listées bien comme il faut ici
            même :
          </H2>

          <Mosaic posts={cmds} />

          <Hr />

          <Paragraph>
            Voilà, c'est tout pour aujourd'hui, merci d'être passé !
            <br />
            <br />
            Guillaume
          </Paragraph>
        </Layout.SmallSection>

        <Footer />
        <span className={styles.fix} />
      </Layout.Wrapper>

      <Preview />
    </Layout.Page>
  );
}
