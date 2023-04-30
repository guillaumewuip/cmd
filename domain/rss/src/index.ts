import fs from "fs";
import path from "path";
import { Feed } from "feed";

import { Post } from "@cmd/domain-post";
import { posts, excerpt } from "@cmd/posts";

const author = {
  name: "Guillaume",
  email: "guillaume@wuips.com",
  link: "https://twitter.com/guillaumewuip",
};

export async function generateFeeds({
  siteBaseURL,
  postRelativeURL,
  outputDir,
}: {
  siteBaseURL: string;
  postRelativeURL: (post: Post.Post) => string;
  outputDir: string;
}) {
  const feed = new Feed({
    title: "cerfeuil et musique douce",
    description: "cerfeuil et musique douce",
    id: siteBaseURL,
    link: siteBaseURL,
    language: "fr-FR",
    image: `http://${siteBaseURL}/logo.svg`,
    favicon: `http://${siteBaseURL}/favicon.ico`,
    copyright: "All rights reserved 2023, Guillaume Clochard",
    updated: new Date(), // optional, default = today
    generator: "cmd", // optional, default = 'Feed for Node.js'
    feedLinks: {
      rss2: `${siteBaseURL}/rss/feed.xml`,
      json: `${siteBaseURL}/rss/feed.json`,
      atom: `${siteBaseURL}/rss/atom.xml`,
    },
    author,
  });

  // for each posts, call excerpt and call feed.addItem
  // eslint-disable-next-line no-restricted-syntax
  for (const post of posts) {
    // eslint-disable-next-line no-await-in-loop
    const postExcerpt = await excerpt(post);

    const date = new Date(post.publishedAt);
    date.setHours(8);

    feed.addItem({
      title: post.title,
      id: `${siteBaseURL}${postRelativeURL(post)}`,
      link: `${siteBaseURL}${postRelativeURL(post)}`,
      description: postExcerpt,
      date,
      image: `${siteBaseURL}${post.image.src}`,
    });
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "feed.xml"), feed.rss2());
  fs.writeFileSync(path.join(outputDir, "atom.xml"), feed.atom1());
  fs.writeFileSync(path.join(outputDir, "feed.json"), feed.json1());
}
