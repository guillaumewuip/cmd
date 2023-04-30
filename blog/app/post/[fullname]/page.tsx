import React from "react";
import type { Metadata } from "next";

import { posts, postFromId, PostContent, excerpt } from "@cmd/posts";

import { Article } from "@cmd/ui-article";
import * as Layout from "@cmd/ui-layout";

import * as SiteMetadata from "../../../metadata";
import { Footer } from "../../../components/Footer";
import { Preview } from "../../../components/Player";
import { Header } from "../../../components/Header";
import { components } from "../../../components/MDXComponents";

export async function generateStaticParams() {
  const params = posts.map((post) => ({
    fullName: post.id,
  }));

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { fullname: string };
}): Promise<Metadata> {
  const post = postFromId(params.fullname);

  if (!post) {
    throw new Error(`Post not found: ${params.fullname}`);
  }

  const url = `${SiteMetadata.site.url}${SiteMetadata.postUrl(post)}`;
  const imageUrl = `${SiteMetadata.site.url}${post.image.src}`;

  const title = `${post.title} - ${SiteMetadata.site.name}`;
  const description = await excerpt(post);

  return {
    title,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: imageUrl,
    },
  };
}

export default async function Page({
  params,
}: {
  params: { fullname: string };
}) {
  const post = postFromId(params.fullname);

  if (!post) {
    throw new Error(`Post not found: ${params.fullname}`);
  }

  return (
    <div>
      <Layout.Wrapper>
        <Header />
        <Article
          post={post}
          content={<PostContent post={post} components={components} />}
        />
        <Footer />
      </Layout.Wrapper>

      <Preview />
    </div>
  );
}
