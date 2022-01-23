import { pipe } from "fp-ts/function";

import * as EmbedableLink from "../EmbedableLink";

import * as Youtube from "./Youtube";
import * as Soundcloud from "./Soundcloud";
import * as Bandcamp from "./Bandcamp";

export function TrackPlayer({
  embedableLink,
}: {
  embedableLink: EmbedableLink.EmbedableLink;
}): JSX.Element {
  return pipe(
    embedableLink,
    EmbedableLink.fold({
      Youtube: (link) => (
        <Youtube.Player trackId={EmbedableLink.trackId(link)} />
      ),
      Soundcloud: (link) => (
        <Soundcloud.Player href={EmbedableLink.href(link)} />
      ),
      Bandcamp: (link) => <Bandcamp.Player href={EmbedableLink.href(link)} />,
    })
  );
}
