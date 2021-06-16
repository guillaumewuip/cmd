import fs from 'fs';
import { Feed } from 'feed';

import { pipe } from 'fp-ts/function'
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';

import * as Posts from './posts'

const siteURL = "http://cmd.wuips.com"

const author = {
  name: "Guillaume Clochard",
  email: "guillaume@wuips.com",
  link: "https://twitter.com/guillaumewuip",
};

export async function generateFeeds() {
  const feed = new Feed({
    title: "cerfeuil et musique douce",
    description: "This is my personal feed!",
    id: siteURL,
    link: siteURL,
    language: "fr-FR",
    image: `http://${siteURL}/logo.svg`,
    favicon: `http://${siteURL}/favicon.ico`,
    copyright: "All rights reserved 2021, Guillaume Clochard",
    updated: new Date(), // optional, default = today
    generator: "cmd", // optional, default = 'Feed for Node.js'
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`,
      json: `${siteURL}/rss/feed.json`,
      atom: `${siteURL}/rss/atom.xml`,
    },
    author,
  });

  const postInfos = await Posts.getAllPostInfos()

  pipe(
    postInfos,
    ReadonlyArrayFP.map(({ rawCreatedAt, infos }) => {
      feed.addItem({
        title: infos.metadata.title,
        id: infos.url,
        link: infos.url,
        description: infos.metadata.description,
        author: [
          author
        ],
        date: rawCreatedAt,
        image: `${siteURL}${infos.metadata.image.src}`
      })
    })
  )

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
}
