import { NextResponse } from "next/server";

import { parseHTML } from "linkedom";

async function fetchPage(url: string): Promise<Document> {
  const response = await fetch(url);
  const documentString = await response.text();

  return parseHTML(documentString).window.document;
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

function extractThumbnail(document: Document): string | null {
  const meta = document.querySelector('meta[property="og:image"]');

  if (!meta) {
    throw new Error(`Can't find og:image meta tag`);
  }

  const href = meta.getAttribute("content");

  return href;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || Array.isArray(url)) {
    return NextResponse.json(
      {
        error: "Missing correct url query parameter",
      },
      {
        status: 400,
      }
    );
  }

  const page = await fetchPage(decodeURIComponent(url));
  const trackId = extractTrackId(page);
  const thumbnail = extractThumbnail(page);

  return NextResponse.json({
    trackId,
    thumbnail,
  });
}
