import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";

import * as Either from "fp-ts/Either";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import {
  register,
  loadBandcamp,
  loadBandcampThumbnail,
  loadSoundcloud,
  loadSoundcloudThumbnail,
  loadYoutube,
  Track,
  Source,
  EmbedableLink,
} from "@cmd/domain-player";

import { VisuallyAndAriaHidden } from "../components/Hidden";

import TrackBar from "./TrackBar";

import { previousTitle } from "./previousTitle";
import { position } from "./position";

type TrackPositionInfos = {
  title: string;
  weight: number;
};

function PlayerClientWrapper({
  children,
}: {
  children: (infos: TrackPositionInfos) => React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  const [infos, setTrackInfos] = useState<TrackPositionInfos | null>(null);

  useLayoutEffect(() => {
    if (!container.current) {
      throw new Error(`Container is not mounted`);
    }

    const title = previousTitle(container.current);
    const weight = position(container.current);

    if (Option.isNone(title)) {
      throw new Error(`title not found for track ${weight}`);
    }

    setTrackInfos({ title: title.value, weight });
  }, []);

  return <div ref={container}>{infos && children(infos)}</div>;
}

function YoutubeClient({
  embedableLink,
  title,
  weight,
}: {
  embedableLink: EmbedableLink.Youtube;
  title: string;
  weight: number;
}) {
  const track = useMemo(() => {
    const id = EmbedableLink.slugify(embedableLink);

    const source = Source.createYoutube({
      embedableLink,
    });

    return Track.create({
      id,
      title,
      source,
    });
  }, [embedableLink, title]);

  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    register({ track, weight });

    loadYoutube({
      track,
    })();
  }, [track, weight]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={track.source.container} tabIndex={-1} />
      </VisuallyAndAriaHidden>
      <TrackBar id={track.id} />
    </>
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

function BandcampClient({
  embedableLink,
  streamUrl,
  thumbnail,
  title,
  weight,
}: {
  embedableLink: EmbedableLink.Bandcamp;
  streamUrl: string;
  thumbnail: string;
  title: string;
  weight: number;
}) {
  const track = useMemo(() => {
    const id = EmbedableLink.slugify(embedableLink);

    const source = Source.createBandcamp({
      embedableLink,
      streamUrl,
      thumbnail,
    });

    return Track.create({
      id,
      title,
      source,
    });
  }, [embedableLink, streamUrl, thumbnail, title]);

  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    register({ track, weight });

    loadBandcamp({
      track,
    })();
  }, [track, weight]);

  return <TrackBar id={track.id} />;
}

async function Bandcamp({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Bandcamp;
}) {
  const result = await loadBandcampThumbnail({
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

function SoundcloudClient({
  embedableLink,
  soundcloudId,
  thumbnail,
  title,
  weight,
}: {
  embedableLink: EmbedableLink.Soundcloud;
  soundcloudId: string;
  thumbnail: string;
  title: string;
  weight: number;
}) {
  const track = useMemo(() => {
    const id = EmbedableLink.slugify(embedableLink);

    const source = Source.createSoundcloud({
      embedableLink,
      soundcloudId,
      thumbnail,
    });

    return Track.create({
      id,
      title,
      source,
    });
  }, [embedableLink, soundcloudId, thumbnail, title]);

  useEffect(() => {
    if (!Track.isReserved(track)) {
      return;
    }

    register({ track, weight });

    loadSoundcloud({
      track,
    })();
  }, [track, weight]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={track.source.container} tabIndex={-1} />
      </VisuallyAndAriaHidden>
      <TrackBar id={track.id} />
    </>
  );
}

async function Soundcloud({
  embedableLink,
}: {
  embedableLink: EmbedableLink.Soundcloud;
}) {
  const result = await loadSoundcloudThumbnail({
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

export function TrackPlayer({
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
