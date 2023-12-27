import { Feed } from "feed";

import * as Content from "@cmd/domain-content";
import * as Posts from "@cmd/posts";

const author = {
  name: "Guillaume",
  email: "guillaume@wuips.com",
  link: "https://twitter.com/guillaumewuip",
};

export async function generateFeeds({
  siteBaseURL,
  relativeURL,
}: {
  siteBaseURL: string;
  relativeURL: (post: Content.Content) => string;
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
  for (const item of Posts.all) {
    // eslint-disable-next-line no-await-in-loop
    const postExcerpt = await Posts.excerpt(item);

    const date = new Date(item.publishedAt);
    date.setHours(8);

    feed.addItem({
      title: item.title,
      id: `${siteBaseURL}${relativeURL(item)}`,
      link: `${siteBaseURL}${relativeURL(item)}`,
      description: postExcerpt,
      date,
      image: `${siteBaseURL}${item.image.src}`,
    });
  }

  return {
    rss2: feed.rss2,
    atom1: feed.atom1,
    json1: feed.json1,
  };
}
