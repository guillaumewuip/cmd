import '../styles/globals.scss'

import Head from 'next/head'
import { MDXProvider } from '@mdx-js/react'
import { DefaultSeo } from 'next-seo';

import { H1, H2, H3, Link, Paragraph, Code, Blockquote } from '../components/Text'
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
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link type="application/atom+xml" rel="alternate" href="https://cmd.wuips.com/rss/feed.xml" title={Metadata.site.name} />
        <link href="https://github.com/guillaumewuip" rel="me" />
        <link rel="webmention" href="https://webmention.io/cmd.wuips.com/webmention" />
        <link rel="pingback" href="https://webmention.io/cmd.wuips.com/xmlrpc" />
      </Head>
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
      >
      </DefaultSeo>
      <MDXProvider components={mdComponents}>
        <Component {...pageProps} />
      </MDXProvider>
    </>
  )
}

export default MyApp
