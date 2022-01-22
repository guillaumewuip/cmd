import * as Option from 'fp-ts/Option'

import * as Union from '@fp51/opaque-union'

type $Youtube = {
  trackId: string
}

type $Soundcloud = {
  href: string
}

type $Bandcamp = {
  href: string
}

const EmbedableLinkAPI = Union.of({
  Youtube: Union.type<$Youtube>(),
  Soundcloud: Union.type<$Soundcloud>(),
  Bandcamp: Union.type<$Bandcamp>(),
})

export type EmbedableLink = Union.Type<typeof EmbedableLinkAPI>
export type Youtube = ReturnType<typeof EmbedableLinkAPI.of.Youtube>
export type Soundcloud = ReturnType<typeof EmbedableLinkAPI.of.Soundcloud>
export type Bandcamp = ReturnType<typeof EmbedableLinkAPI.of.Bandcamp>

export const fold = EmbedableLinkAPI.fold
export const trackId = EmbedableLinkAPI.Youtube.lensFromProp('trackId').get
export const href = Union.pick(EmbedableLinkAPI, ['Soundcloud', 'Bandcamp']).lensFromProp('href').get

export function parseLink(href: string): Option.Option<EmbedableLink> {
  if (href.includes('youtube.com/watch')) {
    const result = href.match(/.*v=(?<id>.*)/)

    if (result === null) {
      return Option.none
    }

    const { groups: { id } = { id: undefined } } = result

    if (id === undefined) {
      return Option.none
    }

    return Option.some(EmbedableLinkAPI.of.Youtube({ trackId: id }))
  }

  if (href.includes('soundcloud.com/')) {
    return Option.some(EmbedableLinkAPI.of.Soundcloud({ href }))
  }

  if (href.includes('bandcamp.com/track')) {
    return Option.some(EmbedableLinkAPI.of.Bandcamp({ href }))
  }


  return Option.none
}
