import dynamic from 'next/dynamic'
import Head from 'next/head'

import { pipe } from 'fp-ts/function';
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';

import * as Metadata from '../../lib/postMetadata'
import * as Filename from '../../lib/postFilename'
import * as Posts from '../../lib/posts'

import * as Layout from '../../layout/Default'

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
        <Article.Article metadata={metadata} createdAt={createdAt} content={<Content />} />
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps({ params: { fullName } }: { params: { fullName: string }}) {
  const { metadata, createdAt } = await Posts.getPostInfosFromFullname(fullName)

  return {
    props: {
      fullName,
      metadata,
      createdAt,
    },
  }
}

export async function getStaticPaths() {
  const filenames = Posts.getPostFilenames()

  const paths = pipe(
    filenames,
    ReadonlyArrayFP.map(filename => ({
      params: {
        fullName: Filename.fullNameFromFilename(filename),
      }
    }))
  )

  return {
    paths,
    fallback: false
  }
}

export default Page
