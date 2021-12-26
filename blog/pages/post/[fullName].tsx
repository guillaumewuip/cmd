import dynamic from 'next/dynamic'
import Head from 'next/head'
import { NextSeo } from 'next-seo';

import { Post } from '@cmd/domain-post'

import { Article } from '@cmd/ui-article'
import * as Layout from '@cmd/ui-layout'
import { Header } from '@cmd/ui-header'
import { Footer } from '@cmd/ui-footer'

import {
  getPostInfosFromFullname,
  getAllPostsPaths,
} from '../../lib/posts'

import * as SiteMetadata from '../../metadata'

function Page({
  post
}: {
  post: Post.Post
}) {
  const Content = dynamic(() => import(`../../_posts/${post.infos.fullName}.mdx`))

  const url = `${SiteMetadata.site.url}/post/${post.infos.fullName}`
  const imageUrl = `${SiteMetadata.site.url}${post.infos.metadata.image.src}`

  const title = `${post.infos.metadata.title} - ${SiteMetadata.site.name}`

  return (
    <div>
      <Head>
        <title>{post.infos.metadata.title} - {SiteMetadata.site.name}</title>
      </Head>

      <NextSeo
        openGraph={{
          description: post.excerpt,
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
        <Article metadata={post.infos.metadata} createdAt={post.infos.createdAt} content={<Content />} />
        <Footer />
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps({ params: { fullName } }: { params: { fullName: string }}) {
  const post = await getPostInfosFromFullname(fullName)

  return {
    props: {
      post
    },
  }
}

export async function getStaticPaths() {
  const paths = getAllPostsPaths()

  return {
    paths,
    fallback: false
  }
}

export default Page
