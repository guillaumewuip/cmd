/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-loading-skeleton/dist/skeleton.css";

import { DefaultSeo } from "next-seo";
import { lightThemeClass, darkThemeClass } from "@cmd/ui-theme";
import { ThemeProvider } from "next-themes";

import * as Metadata from "../src/metadata";

function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: object;
}) {
  return (
    <ThemeProvider
      attribute="class"
      value={{
        light: lightThemeClass,
        dark: darkThemeClass,
      }}
    >
      <DefaultSeo
        openGraph={{
          title: Metadata.site.name,
          site_name: Metadata.site.name,
          locale: "fr_FR",
          url: Metadata.site.url,
          description: Metadata.description,
          type: "website",
          profile: {
            username: Metadata.author.name,
          },
        }}
        twitter={{
          handle: Metadata.author.twitter.id,
          cardType: "summary",
        }}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
