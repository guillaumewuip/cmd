import { Post } from "@cmd/domain-content";

export const site = {
  name: "cmd - cerfeuil et musique douce",
  url: "http://cmd.wuips.com",
};

export const description = "";

export const author = {
  name: "Guillaume",
  twitter: {
    id: "@guillaumewuip",
  },
};

export const postUrl = (post: Post.Post) => `/post/${post.id}`;
