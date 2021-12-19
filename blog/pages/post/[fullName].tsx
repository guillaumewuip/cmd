import dynamic from 'next/dynamic'
import Head from 'next/head'
import { NextSeo } from 'next-seo';

import * as Posts from '../../lib/posts'

import * as Layout from '../../layout/Default'

import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import * as Article from '../../components/Article'

import * as SiteMetadata from '../../metadata'

function Page({
  post
}: {
  post: Posts.Post
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
        <Article.Article metadata={post.infos.metadata} createdAt={post.infos.createdAt} content={<Content />} />
        <Footer />
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps({ params: { fullName } }: { params: { fullName: string }}) {
  const post = await Posts.getPostInfosFromFullname(fullName)

  return {
    props: {
      post
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
