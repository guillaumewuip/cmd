import * as Infos from './infos';

export type Post = Readonly<{
  infos: Infos.Infos,
  excerpt: string,
}>
