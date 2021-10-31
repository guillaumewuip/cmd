import fs from 'fs';
import { Feed } from 'feed';
import { parse as parseDate } from 'date-fns'

import { pipe } from 'fp-ts/function'
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';

import * as Posts from './posts'

const siteURL = "http://cmd.wuips.com"

const author = {
  name: "Guillaume",
  email: "guillaume@wuips.com",
  link: "https://twitter.com/guillaumewuip",
};

export async function generateFeeds() {
  const feed = new Feed({
    title: "cerfeuil et musique douce",
    description: "cerfeuil et musique douce",
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
    ReadonlyArrayFP.map(post => {
      const date = parseDate(post.infos.createdAt, 'dd/MM/y', new Date())
      date.setHours(8)

      feed.addItem({
        title: post.infos.metadata.title,
        id: post.infos.url,
        link: post.infos.url,
        description: post.excerpt,
        date,
        image: `${siteURL}${post.infos.metadata.image.src}`
      })
    })
  )

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
}
