import { pipe } from "fp-ts/function";

import * as Either from "fp-ts/Either";

import {
  fetchBandcampInfos,
  fetchSoundcloudInfos,
  EmbedableLink,
} from "@cmd/domain-player";

import {
  BandcampClient,
  YoutubeClient,
  SoundcloudClient,
} from "./TrackPlayerClient";

export { Skeleton as TrackPlayerSkeleton } from "./Skeleton";

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
    <SoundcloudClient
      embedableLink={embedableLink}
      soundcloudId={result.right.soundcloudId}
      thumbnail={result.right.thumbnail}
    />
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
    <BandcampClient
      embedableLink={embedableLink}
      streamUrl={result.right.streamUrl}
      thumbnail={result.right.thumbnail}
    />
  );
}

async function Youtube({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Youtube;
}) {
  return <YoutubeClient embedableLink={embedableLink} />;
}

export async function TrackPlayer({
  embedableLink,
}: {
  embedableLink: EmbedableLink.EmbedableLink;
}) {
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
