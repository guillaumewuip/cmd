import dynamic from 'next/dynamic'
import Head from 'next/head'

import * as PostMetadata from '../../lib/postMetadata'
import * as Posts from '../../lib/posts'

import * as Layout from '../../layout/Default'

import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import * as Article from '../../components/Article'

import * as SiteMetadata from '../../metadata'

function Page({
  fullName,
  metadata,
  createdAt,
}: {
  fullName: string,
  metadata: PostMetadata.PostMetadata,
  createdAt: string,
}) {
  const Content = dynamic(() => import(`../../_posts/${fullName}.mdx`))

  return (
    <div>
      <Head>
        <title>{metadata.title} - {SiteMetadata.site.name}</title>
        <link rel="icon" href="/favicon.png" />

        <meta name="author" content={SiteMetadata.author.name} />
        <meta name="description" content={metadata.description} />

        <meta name="twitter:creator" content={SiteMetadata.author.twitter.id} />
        <meta name="twitter:description" content={SiteMetadata.description} />
        <meta name="twitter:card" content="summary" />
        <meta property="twitter:title" content={SiteMetadata.site.name} />
        <meta name="twitter:image" content={metadata.image.src} />

        <meta property="og:title" content={metadata.title} />
        <meta property="og:site_name" content={SiteMetadata.site.name} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:url" content={SiteMetadata.site.url} />
        <meta property="og:description" content={metadata.description} />

        <link rel="canonical" href={`${SiteMetadata.site.url}/post/${fullName}`} />

        <script type="application/ld+json">
          {'{'}
            "@type": "WebSite",
            "@context": "https://schema.org"
            "headline": "{metadata.title}",
            "description": "{SiteMetadata.description}",
            "url": "{SiteMetadata.site.url}",
            "name": "{SiteMetadata.site.name}",
          {'}'}
        </script>

        <link type="application/atom+xml" rel="alternate" href="https://cmd.wuips.com/rss/feed.xml" title={SiteMetadata.site.name} />
      </Head>

      <Layout.Wrapper>
        <Header />
        <Article.Article metadata={metadata} createdAt={createdAt} content={<Content />} />
        <Footer />
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps({ params: { fullName } }: { params: { fullName: string }}) {
  const { infos: { metadata, createdAt } } = await Posts.getPostInfosFromFullname(fullName)

  return {
    props: {
      fullName,
      metadata,
      createdAt,
    },
  }
}

export async function getStaticPaths() {
  const paths = Posts.getAllPostsPaths()

  return {
    paths,
    fallback: false
  }
}

export default Page
