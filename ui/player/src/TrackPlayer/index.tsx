/* eslint-disable react/no-unstable-nested-components */
import { useLayoutEffect, useMemo, useState } from "react";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import { register } from "@cmd/domain-player";

import * as EmbedableLink from "../EmbedableLink";

import * as Youtube from "./Youtube";
import * as Soundcloud from "./Soundcloud";
import * as Bandcamp from "./Bandcamp";

import { previousTitle } from "./previousTitle";
import { position } from "./position";

export function TrackPlayer({
  embedableLink,
}: {
  embedableLink: EmbedableLink.EmbedableLink;
}): JSX.Element {
  const [initialized, setInitialized] = useState(false);

  const id = useMemo(
    () => EmbedableLink.slugify(embedableLink),
    [embedableLink]
  );

  useLayoutEffect(() => {
    const title = previousTitle(id);
    const weight = position(id);

    if (Option.isNone(title)) {
      throw new Error(`Can't find title for ${id}`);
    }

    register({
      id,
      title: title.value,
      weight,
    })();

    setInitialized(true);
  }, [id, embedableLink]);

  return (
    <div id={id}>
      {initialized &&
        pipe(
          embedableLink,
          EmbedableLink.fold({
            Youtube: (link) => (
              <Youtube.Player id={id} youtubeId={EmbedableLink.trackId(link)} />
            ),
            Soundcloud: (link) => (
              <Soundcloud.Player id={id} href={EmbedableLink.href(link)} />
            ),
            Bandcamp: (link) => (
              <Bandcamp.Player id={id} href={EmbedableLink.href(link)} />
            ),
          })
        )}
    </div>
  );
}
