import dynamic from 'next/dynamic'
import Head from 'next/head'
import { NextSeo } from 'next-seo';

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

  const url = `${SiteMetadata.site.url}/post/${fullName}`
  const imageUrl = `${SiteMetadata.site.url}${metadata.image.src}`

  const title = `${metadata.title} - ${SiteMetadata.site.name}`

  return (
    <div>
      <Head>
        <title>{metadata.title} - {SiteMetadata.site.name}</title>
      </Head>

      <NextSeo
        openGraph={{
          description: metadata.description,
          title,
          url,
          images: [{ url: imageUrl }],
          type: 'article',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

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
