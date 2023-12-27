import { NextResponse } from "next/server";

import { generateFeeds } from "@cmd/domain-rss";

import * as BlogMetadata from "../../../metadata";

export async function GET() {
  const { atom1 } = await generateFeeds({
    siteBaseURL: BlogMetadata.site.url,
    relativeURL: BlogMetadata.contentRelativeUrl,
  });

  return new NextResponse(atom1());
}
