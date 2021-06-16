import dynamic from 'next/dynamic'
import Head from 'next/head'

import * as Metadata from '../../lib/postMetadata'
import * as Posts from '../../lib/posts'

import * as Layout from '../../layout/Default'

import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import * as Article from '../../components/Article'

function Page({
  fullName,
  metadata,
  createdAt,
}: {
  fullName: string,
  metadata: Metadata.PostMetadata,
  createdAt: string,
}) {
  const Content = dynamic(() => import(`../../_posts/${fullName}.mdx`))

  return (
    <div>
      <Head>
        <title>{metadata.title} - cerfeuil et musique douce</title>
        <link rel="icon" href="/favicon.ico" />
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
