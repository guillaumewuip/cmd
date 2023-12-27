import { Content } from "@cmd/domain-content";

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

export const contentRelativeUrl = (content: Content) => {
  switch (content.type) {
    case "POST":
      return `/post/${content.id}`;
    case "MIX":
      return `/mix/${content.id}`;
  }
};
