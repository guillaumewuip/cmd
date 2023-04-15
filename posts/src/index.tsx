import React from "react";
import ReactDOMServer from "react-dom/server";
import { parseISO } from "date-fns";

import { getMDXComponent } from "next-contentlayer/hooks";

import { Post } from "@cmd/domain-post";

// eslint-disable-next-line import/extensions
import { allPosts, Post as MarkdownPost } from "../.contentlayer/generated";

export const excerpt = async (post: Post.Post) => {
  const MDXContent = getMDXComponent(post.content);

  const markup = ReactDOMServer.renderToStaticMarkup(<MDXContent />);

  const { JSDOM } = await import("jsdom");
  const { document } = new JSDOM(markup).window;

  // take all paragraphs before the first h2
  const result = document.evaluate(".//h2[1]//preceding::p", document, null, 0);

  const nodes: Node[] = [];
  let node = result.iterateNext();

  while (node) {
    nodes.push(node);
    node = result.iterateNext();
  }

  return nodes.map((localNode) => localNode.textContent).join("\n");
};

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

export function PostContent({
  post,
  components,
}: {
  post: Post.Post;
  components: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h3: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    a: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: (props: any) => JSX.Element;
    hr: () => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote: (props: any) => JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    player: (props: any) => JSX.Element;
  };
}) {
  const MDXContent = React.useMemo(
    () => getMDXComponent(post.content),
    [post.content]
  );

  return <MDXContent components={components} />;
}
