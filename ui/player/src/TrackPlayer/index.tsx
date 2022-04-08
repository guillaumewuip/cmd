/* eslint-disable react/no-unstable-nested-components */
import { useLayoutEffect, useMemo, useState, useEffect, useRef } from "react";

import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import {
  register,
  EmbedableLink,
  loadBandcamp,
  loadSoundcloud,
  loadYoutube,
} from "@cmd/domain-player";

import { VisuallyAndAriaHidden } from "../components/Hidden";
import TrackBar from "./TrackBar";

import { previousTitle } from "./previousTitle";
import { position } from "./position";

function Bandcamp({ id, href }: { id: string; href: string }) {
  useEffect(() => {
    loadBandcamp({
      id,
      bandcampUrl: href,
    })();
  }, [id, href]);

  return <TrackBar id={id} />;
}

function Soundcloud({ id, href }: { id: string; href: string }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current === null) {
      throw new Error("Soundcloud ref is empty");
    }

    loadSoundcloud({
      id,
      soundcloudUrl: href,
      container: ref.current,
    })();
  }, [id, href]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={ref} tabIndex={-1} />
      </VisuallyAndAriaHidden>

      <TrackBar id={id} />
    </>
  );
}

function Youtube({ id, youtubeId }: { id: string; youtubeId: string }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current === null) {
      throw new Error("Youtube ref is empty");
    }

    loadYoutube({
      id,
      youtubeId,
      container: ref.current,
    })();
  }, [id, youtubeId]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={ref} tabIndex={-1} />
      </VisuallyAndAriaHidden>

      <TrackBar id={id} />
    </>
  );
}

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
            Youtube: ({ trackId }) => <Youtube id={id} youtubeId={trackId} />,
            Soundcloud: ({ href }) => <Soundcloud id={id} href={href} />,
            Bandcamp: ({ href }) => <Bandcamp id={id} href={href} />,
          })
        )}
    </div>
  );
}
