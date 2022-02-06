import { Metadata } from "./metadata";

import * as Infos from "./infos";

export type Post = Readonly<{
  infos: Infos.Infos;
  excerpt: string;
}>;

export function create({
  fullName,
  createdAt,
  url,
  metadata,
  excerpt,
}: {
  fullName: string;
  createdAt: string;
  url: string;
  metadata: Metadata;
  excerpt: string;
}): Post {
  const infos = Infos.create({
    fullName,
    createdAt,
    url,
    metadata,
  });

  return {
    infos,
    excerpt,
  };
}
