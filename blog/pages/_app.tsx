import 'react-loading-skeleton/dist/skeleton.css'

import Head from 'next/head'
import { MDXProvider } from '@mdx-js/react'
import { DefaultSeo } from 'next-seo';
import { themeClassName } from '@cmd/ui-theme'
import { H1, H2, H3, Paragraph, Code, Blockquote } from '@cmd/ui-text'

import { Link } from '../components/Text'
import { Hr } from '../components/Hr'

import * as Metadata from '../metadata'

const mdComponents = {
  h1: (props: any) => <H1 {...props} />,
  h2: (props: any) => <H2 {...props} />,
  h3: (props: any) => <H3 {...props} />,
  a: (props: any) => <Link {...props} />,
  p: (props: any) => <Paragraph {...props} />,
  hr: () => <Hr  />,
  code: (props: any) => <Code {...props} />,
  blockquote: (props: any) => <Blockquote {...props} />,
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
        <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap" rel="stylesheet" />
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
      </MDXProvider>
    </div>
  )
}

export default MyApp
