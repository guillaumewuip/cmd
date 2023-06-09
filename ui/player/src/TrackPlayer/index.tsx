import { pipe } from "fp-ts/function";

import * as Either from "fp-ts/Either";

import {
  fetchBandcampInfos,
  fetchSoundcloudInfos,
  EmbedableLink,
} from "@cmd/domain-player";

import { PlayerClientWrapper } from "./PlayerClientWrapper";

import { BandcampClient } from "./Bandcamp";
import { YoutubeClient } from "./Youtube";
import { SoundcloudClient } from "./Soundcloud";

async function Soundcloud({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Soundcloud;
}) {
  const result = await fetchSoundcloudInfos({
    href: embedableLink.href,
  })();

  if (Either.isLeft(result)) {
    throw result.left;
  }

  return (
    <PlayerClientWrapper>
      {(infos) => (
        <SoundcloudClient
          embedableLink={embedableLink}
          soundcloudId={result.right.soundcloudId}
          thumbnail={result.right.thumbnail}
          {...infos}
        />
      )}
    </PlayerClientWrapper>
  );
}

async function Bandcamp({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Bandcamp;
}) {
  const result = await fetchBandcampInfos({
    href: embedableLink.href,
  })();

  if (Either.isLeft(result)) {
    throw result.left;
  }

  return (
    <PlayerClientWrapper>
      {(infos) => (
        <BandcampClient
          embedableLink={embedableLink}
          streamUrl={result.right.streamUrl}
          thumbnail={result.right.thumbnail}
          {...infos}
        />
      )}
    </PlayerClientWrapper>
  );
}

async function Youtube({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Youtube;
}) {
  return (
    <PlayerClientWrapper>
      {(infos) => <YoutubeClient embedableLink={embedableLink} {...infos} />}
    </PlayerClientWrapper>
  );
}

export async function TrackPlayer({
  embedableLink,
}: {
  embedableLink: EmbedableLink.EmbedableLink;
}) {
  console.log("track player", { embedableLink });

  // @ts-expect-error toto
  if (1 === 2) {
    return pipe(
      embedableLink,
      EmbedableLink.fold({
        // @ts-expect-error server components
        Youtube: (link) => <Youtube embedableLink={link} />,
        // @ts-expect-error server components
        Bandcamp: (link) => <Bandcamp embedableLink={link} />,
        // @ts-expect-error server components
        Soundcloud: (link) => <Soundcloud embedableLink={link} />,
      })
    );
  }

  return "track player";
}
