import * as Metadata from './metadata';

export type Infos = Readonly<{
  fullName: string
  url: string,
  metadata: Metadata.Metadata,
  createdAt: string,
}>
