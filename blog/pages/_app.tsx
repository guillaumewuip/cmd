import 'react-loading-skeleton/dist/skeleton.css'

import Head from 'next/head'

import * as Option from 'fp-ts/Option'

import { MDXProvider, MDXProviderComponents } from '@mdx-js/react'
import { DefaultSeo } from 'next-seo';
import { themeClassName } from '@cmd/ui-theme'
import { H1, H2, H3, Paragraph, Code, Blockquote, Link, Hr } from '@cmd/ui-text'
import * as Player from '@cmd/ui-player'

import * as Metadata from '../metadata'

const mdComponents: MDXProviderComponents = {
  h1: (props) => <H1 {...props} />,
  h2: (props) => <H2 {...props} />,
  h3: (props) => <H3 {...props} />,
  a: (props) => <Link {...props} />,
  p: (props) => <Paragraph {...props} />,
  hr: () => <Hr  />,
  code: (props) => <Code {...props} />,
  blockquote: (props) => <Blockquote {...props} />,
  player: (props) => {
    const parsed = Player.parseLink(props.href)

    if (Option.isNone(parsed)) {
      return <p><Link href={props.href}>{props.href}</Link></p>
    }

    return <Player.TrackPlayer embedableLink={parsed.value} />
  },
}

function MyApp({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) {
  return (
    <div className={themeClassName}>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link type="application/atom+xml" rel="alternate" href="https://cmd.wuips.com/rss/feed.xml" title={Metadata.site.name} />
        <link href="https://github.com/guillaumewuip" rel="me" />
        <link rel="webmention" href="https://webmention.io/cmd.wuips.com/webmention" />
        <link rel="pingback" href="https://webmention.io/cmd.wuips.com/xmlrpc" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,700;1,400;1,700&family=IBM+Plex+Mono&display=swap" rel="stylesheet" />

        <script src='https://www.youtube.com/iframe_api' async></script>
        <script src='https://w.soundcloud.com/player/api.js' async></script>
      </Head>
      {/* @ts-ignore */}
      <DefaultSeo
        openGraph={{
          title: Metadata.site.name,
          site_name: Metadata.site.name,
          locale: 'fr_FR',
          url: Metadata.site.url,
          description: Metadata.description,
          type: 'website',
          profile: {
            username: Metadata.author.name
          }
        }}
        twitter={{
          handle: Metadata.author.twitter.id,
          cardType: 'summary'
        }}
      />
      <MDXProvider components={mdComponents}>
        <Component {...pageProps} />
        <Player.Preview />
      </MDXProvider>
    </div>
  )
}

export default MyApp
