import { Link as RealLink } from '@cmd/ui-text'

import * as MusicEmbed from './MusicEmbed'

export function Link({ href, children } : { href: string, children: string }) {
  if (href === children && MusicEmbed.isEmbedableLink(href)) {
    return <MusicEmbed.MusicEmbedLink href={href} />
  }

  return <RealLink href={href}>{children}</RealLink>
}
