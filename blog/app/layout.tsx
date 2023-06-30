import { Rubik } from "next/font/google";
import Script from "next/script";

import "react-loading-skeleton/dist/skeleton.css";

import * as BlogMetadata from "../metadata";

import { ThemeProvider } from "../components/ThemeProvider";

const rubik = Rubik({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
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
    <html lang="fr" className={rubik.className} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Script src="https://www.youtube.com/iframe_api" />
        <Script src="https://w.soundcloud.com/player/api.js" />
      </body>
    </html>
  );
}

export const revalidate = 60; // 1m - needed for bandcamp stream url that have a lifetime limit
