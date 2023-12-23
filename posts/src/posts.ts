import { parseISO } from "date-fns";

import { Post } from "@cmd/domain-content";

// eslint-disable-next-line import/extensions
import { allPosts, Post as MarkdownPost } from "../.contentlayer/generated";

export const posts = allPosts
  .map((markdownPost: MarkdownPost) => {
    const post = Post.create({
      id: markdownPost.id,
      title: markdownPost.title,
      publishedAt: markdownPost.publishedAt,
      image: markdownPost.image,
      content: markdownPost.body.code,
    });

    return post;
  })
  .sort(
    // sort the post to have the most recent first
    (postA, postB) =>
      parseISO(postB.publishedAt).getTime() -
      parseISO(postA.publishedAt).getTime()
  );

export const lastPost = posts[0];

export const postFromId = (id: string) => {
  // find the post from the id
  return posts.find((post) => post.id === id);
};
