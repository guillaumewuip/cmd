import * as Either from "fp-ts/Either";
import * as TaskEither from "fp-ts/TaskEither";

import { retry } from "./retry";

async function fetchPage(url: string): Promise<Document> {
  const response = await fetch(url);
  const markup = await response.text();

  const { JSDOM } = await import("jsdom");
  const { document } = new JSDOM(markup).window;

  return document;
}

function extractTrackId(document: Document) {
  const metaContentElement = document.querySelector(
    'meta[content^="soundcloud://sounds:"]'
  );

  if (!metaContentElement) {
    throw new Error(`Can't find meta tag`);
  }

  const content = metaContentElement.getAttribute("content");

  if (!content) {
    throw new Error(`No content on meta tag`);
  }

  const result = content.match(/sounds:(?<id>\d*)/);

  if (result === null) {
    throw new Error(`Can't find trackId`);
  }

  const { groups: { id } = { id: undefined } } = result;

  if (id === undefined) {
    throw new Error(`Can't find trackId`);
  }

  return id;
}

function extractThumbnail(document: Document): string {
  const meta = document.querySelector('meta[property="og:image"]');

  if (!meta) {
    throw new Error(`Can't find og:image meta tag`);
  }

  const href = meta.getAttribute("content");

  return href || "";
}

export function fetchSoundcloudInfos({
  href,
}: {
  href: string;
}): TaskEither.TaskEither<
  Error,
  {
    soundcloudId: string;
    thumbnail: string;
  }
> {
  return retry(() =>
    TaskEither.tryCatch(async () => {
      const page = await fetchPage(href);
      const soundcloudId = extractTrackId(page);
      const thumbnail = extractThumbnail(page);

      return {
        soundcloudId,
        thumbnail,
      };
    }, Either.toError)
  );
}
