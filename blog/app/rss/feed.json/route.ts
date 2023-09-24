import { NextResponse } from "next/server";

import { generateFeeds } from "@cmd/domain-rss";

import * as BlogMetadata from "../../../metadata";

export async function GET() {
  const { json1 } = await generateFeeds({
    siteBaseURL: BlogMetadata.site.url,
    postRelativeURL: BlogMetadata.postUrl,
  });

  return new NextResponse(json1());
}
