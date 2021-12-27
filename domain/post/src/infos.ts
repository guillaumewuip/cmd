import { Metadata } from '@cmd/domain-metadata';

export type Infos = Readonly<{
  fullName: string
  url: string,
  metadata: Metadata.Metadata,
  createdAt: string,
}>

export function create(infos: Infos): Infos {
  return infos
}
