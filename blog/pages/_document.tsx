import { Html, Head, Main, NextScript } from "next/document";

import * as Metadata from "../src/metadata";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link
          type="application/atom+xml"
          rel="alternate"
          href="https://cmd.wuips.com/rss/feed.xml"
          title={Metadata.site.name}
        />
        <link href="https://github.com/guillaumewuip" />
        <link href="https://webmention.io/cmd.wuips.com/webmention" />
        <link
          rel="pingback"
          href="https://webmention.io/cmd.wuips.com/xmlrpc"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />

        <script src="https://www.youtube.com/iframe_api" async />
        <script src="https://w.soundcloud.com/player/api.js" async />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
