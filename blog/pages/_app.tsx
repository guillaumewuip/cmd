/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-loading-skeleton/dist/skeleton.css";

import * as Option from "fp-ts/Option";

import { MDXProvider } from "@mdx-js/react";
import { DefaultSeo } from "next-seo";
import { themeClassName } from "@cmd/ui-theme";
import {
  H1,
  H2,
  H3,
  Paragraph,
  Code,
  Blockquote,
  Link,
  Hr,
} from "@cmd/ui-text";
import * as Player from "@cmd/ui-player";
import { EmbedableLink } from "@cmd/domain-player";

import * as Metadata from "../src/metadata";

const mdComponents = {
  h1: (props: any) => <H1 {...props} />,
  h2: (props: any) => <H2 {...props} />,
  h3: (props: any) => <H3 {...props} />,
  a: (props: any) => <Link {...props} />,
  p: (props: any) => <Paragraph {...props} />,
  hr: () => <Hr />,
  code: (props: any) => <Code {...props} />,
  blockquote: (props: any) => <Blockquote {...props} />,
  player: (props: any) => {
    const parsed = EmbedableLink.parseLink(props.href);

    if (Option.isNone(parsed)) {
      return (
        <p>
          <Link href={props.href}>{props.href}</Link>
        </p>
      );
    }

    return <Player.TrackPlayer embedableLink={parsed.value} />;
  },
};

function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: object;
}) {
  return (
    <div className={themeClassName}>
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
      <MDXProvider components={mdComponents}>
        <Component {...pageProps} />
        <Player.Preview />
      </MDXProvider>
    </div>
  );
}

export default MyApp;
