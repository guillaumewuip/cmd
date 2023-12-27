import { parseISO } from "date-fns";

import * as Content from "@cmd/domain-content";

// eslint-disable-next-line import/extensions
import {
  allPosts,
  Post as MarkdownPost,
  allMixes,
  Mix as MarkdownMix,
} from "../.contentlayer/generated";

const mostRecentSorter = (
  itemA: { publishedAt: string },
  itemB: { publishedAt: string }
) =>
  parseISO(itemB.publishedAt).getTime() - parseISO(itemA.publishedAt).getTime();

const posts = allPosts
  .map((markdownPost: MarkdownPost) => {
    const post = Content.Post.create({
      id: markdownPost.id,
      title: markdownPost.title,
      publishedAt: markdownPost.publishedAt,
      image: markdownPost.image,
      content: markdownPost.body.code,
    });

    return post;
  })
  .sort(mostRecentSorter);

export const Post = {
  all: posts,
  last: posts[0],
  fromId: (id: string) => {
    return posts.find((post) => post.id === id);
  },
};

const mixes = allMixes
  .map((markdownMix: MarkdownMix) => {
    const mix = Content.Mix.create({
      id: markdownMix.id,
      title: markdownMix.title,
      publishedAt: markdownMix.publishedAt,
      image: markdownMix.image,
      externalUrl: markdownMix.externalUrl,
      content: markdownMix.body.code,
    });

    return mix;
  })
  .sort(mostRecentSorter);

export const all = [...posts, ...mixes].sort(mostRecentSorter);

export const Mix = {
  all: mixes,
  fromId: (id: string) => {
    return mixes.find((post) => post.id === id);
  },
};
