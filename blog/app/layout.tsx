// eslint-disable-next-line camelcase
import { Schibsted_Grotesk, Azeret_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

import "react-loading-skeleton/dist/skeleton.css";

import * as BlogMetadata from "../metadata";

import { ThemeProvider } from "../components/ThemeProvider";

const azeretMono = Azeret_Mono({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-Azeret_Mono",
});

const schibstedGrotesk = Schibsted_Grotesk({
  weight: ["400", "700"],
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-Schibsted_Grotesk",
});

export const metadata = {
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    title: BlogMetadata.site.name,
    description: BlogMetadata.description,
    siteName: BlogMetadata.site.name,
    locale: "fr_FR",
    url: BlogMetadata.site.url,
  },
  twitter: {
    creatorId: BlogMetadata.author.twitter.id,
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning needed for https://github.com/pacocoursey/next-themes/blob/a385b8d865bbb317ff73a5b6c1319ae566f7d6f1/README.md?plain=1#L108
  return (
    <html
      lang="fr"
      className={`${azeretMono.variable} ${schibstedGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Script src="https://www.youtube.com/iframe_api" />
        <Script src="https://w.soundcloud.com/player/api.js" />
        <Script
          data-goatcounter="https://cmd-wuips.goatcounter.com/count"
          src="//gc.zgo.at/count.js"
        />
        <Analytics />
      </body>
    </html>
  );
}

export const revalidate = 60; // 1m - needed for bandcamp stream url that have a lifetime limit
