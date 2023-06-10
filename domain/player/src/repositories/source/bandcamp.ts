import * as Either from "fp-ts/Either";
import * as TaskEither from "fp-ts/TaskEither";

import { retry } from "../retry";

async function fetchPage(url: string): Promise<Document> {
  const response = await fetch(url);
  const markup = await response.text();

  const { JSDOM } = await import("jsdom");

  const { document } = new JSDOM(markup).window;

  return document;
}

function extractStream(document: Document): string {
  const script = document.querySelector("script[data-tralbum]");

  if (!script) {
    throw new Error(`Can't find data-tralbum script tag`);
  }

  const data = JSON.parse(script.getAttribute("data-tralbum") || "");

  const url = Object.values(data.trackinfo[0].file)[0] as string;

  return url;
}

function extractThumbnail(document: Document): string {
  const link = document.querySelector('link[rel="image_src"]');

  if (!link) {
    throw new Error(`Can't find image_src link tag`);
  }

  const href = link.getAttribute("href");

  return href || "";
}

export function fetchBandcampInfos({
  href,
}: {
  href: string;
}): TaskEither.TaskEither<
  Error,
  {
    streamUrl: string;
    thumbnail: string;
  }
> {
  return retry(() =>
    TaskEither.tryCatch(async () => {
      const page = await fetchPage(href);
      const streamUrl = extractStream(page);
      const thumbnail = extractThumbnail(page);

      return {
        streamUrl,
        thumbnail,
      };
    }, Either.toError)
  );
}
