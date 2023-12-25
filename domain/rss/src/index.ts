import { Feed } from "feed";

import * as Content from "@cmd/domain-content";
import { Post, excerpt } from "@cmd/posts";

const author = {
  name: "Guillaume",
  email: "guillaume@wuips.com",
  link: "https://twitter.com/guillaumewuip",
};

export async function generateFeeds({
  siteBaseURL,
  postRelativeURL,
}: {
  siteBaseURL: string;
  postRelativeURL: (post: Content.Post.Post) => string;
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
  for (const post of Post.all) {
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

  return {
    rss2: feed.rss2,
    atom1: feed.atom1,
    json1: feed.json1,
  };
}
