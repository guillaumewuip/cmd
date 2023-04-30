/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Head from "next/head";

import { NextSeo } from "next-seo";

import { posts, lastPost, PostContent } from "@cmd/posts";

import { Article, Mosaic } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";
import { Paragraph, Code, H2, Link, Hr } from "@cmd/ui-text";
import { Header } from "@cmd/ui-header";

import { Post } from "@cmd/domain-post";
import { generateFeeds } from "@cmd/domain-rss";
import * as Player from "@cmd/ui-player";

import * as SiteMetadata from "../src/metadata";
import { components } from "../src/mdxComponents";
import { postUrl } from "../src/postUrl";
import { Footer } from "../components/Footer";

export default function Home({
  lastCmd,
  previousCmds,
}: {
  lastCmd: Post.Post;
  previousCmds: {
    image: Post.Image;
    relativeUrl: string;
    title: string;
    id: string;
  }[];
}) {
  const imageUrl = `${SiteMetadata.site.url}${lastCmd.image.src}`;

  return (
    <Layout.Page>
      <Head>
        <title>{SiteMetadata.site.name}</title>
      </Head>

      <NextSeo
        openGraph={{
          images: [{ url: imageUrl }],
        }}
      />

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
          post={lastCmd}
          content={<PostContent post={lastCmd} components={components} />}
        />

        <Layout.SmallSection>
          <H2>
            Toutes les <Code>cmd</Code> passées listées bien comme il faut ici
            même :
          </H2>

          <Mosaic posts={previousCmds} />

          <Hr />

          <Paragraph>
            Voilà, c'est tout pour aujourd'hui, merci d'être passé !
            <br />
            <br />
            Guillaume
          </Paragraph>
        </Layout.SmallSection>

        <Footer />
      </Layout.Wrapper>

      <Player.Preview />
    </Layout.Page>
  );
}

export async function getStaticProps() {
  await generateFeeds({
    siteBaseURL: SiteMetadata.site.url,
    postRelativeURL: postUrl,
    outputDir: "./public/rss",
  });

  return {
    props: {
      lastCmd: lastPost,
      previousCmds: posts.map((post) => ({
        image: post.image,
        relativeUrl: postUrl(post),
        title: post.title,
        id: post.id,
      })),
    },
  };
}
