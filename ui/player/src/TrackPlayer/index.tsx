/* eslint-disable react/no-unstable-nested-components */
import { useLayoutEffect, useMemo, useState } from "react";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import { register, EmbedableLink } from "@cmd/domain-player";

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
      externalUrl: embedableLink.href,
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
            Youtube: ({ trackId }) => (
              <Youtube.Player id={id} youtubeId={trackId} />
            ),
            Soundcloud: ({ href }) => <Soundcloud.Player id={id} href={href} />,
            Bandcamp: ({ href }) => <Bandcamp.Player id={id} href={href} />,
          })
        )}
    </div>
  );
}
