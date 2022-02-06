import { Metadata } from "./metadata";

export type Infos = Readonly<{
  fullName: string;
  url: string;
  metadata: Metadata;
  createdAt: string;
}>;

export function create(infos: Infos): Infos {
  return infos;
}
