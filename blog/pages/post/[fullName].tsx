import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";

import { posts, postFromId, PostContent, excerpt } from "@cmd/posts";

import * as ReadonlyArrayFP from "fp-ts/ReadonlyArray";
import { pipe } from "fp-ts/function";

import { Post } from "@cmd/domain-post";

import { Article } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";
import { Header } from "@cmd/ui-header";

import * as Player from "@cmd/ui-player";
import * as SiteMetadata from "../../src/metadata";
import { components } from "../../src/mdxComponents";
import { postUrl } from "../../src/postUrl";
import { Footer } from "../../components/Footer";

function Page({ post, postExcerpt }: { post: Post.Post; postExcerpt: string }) {
  const url = `${SiteMetadata.site.url}${postUrl(post)}`;
  const imageUrl = `${SiteMetadata.site.url}${post.image.src}`;

  const title = `${post.title} - ${SiteMetadata.site.name}`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>

      <NextSeo
        openGraph={{
          description: postExcerpt,
          title,
          url,
          images: [{ url: imageUrl }],
          type: "article",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />

      <Layout.Wrapper>
        <Header />
        <Article
          post={post}
          content={<PostContent post={post} components={components} />}
        />
        <Footer />
      </Layout.Wrapper>

      <Player.Preview />
    </div>
  );
}

export async function getStaticProps({
  params: { fullName },
}: {
  params: { fullName: string };
}) {
  const post = postFromId(fullName);
  if (!post) {
    throw new Error(`Post not found: ${fullName}`);
  }

  const postExcerpt = await excerpt(post);

  return {
    props: {
      post,
      postExcerpt,
    },
  };
}

export async function getStaticPaths() {
  const paths: ReadonlyArray<{ params: { fullName: string } }> = pipe(
    posts,
    ReadonlyArrayFP.map((post) => ({
      params: {
        fullName: post.id,
      },
    }))
  );

  return {
    paths,
    fallback: false,
  };
}

export default Page;
