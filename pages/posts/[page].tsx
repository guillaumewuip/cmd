import dynamic from 'next/dynamic'
import Head from 'next/head'

import { pipe } from 'fp-ts/function';
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';

import * as Posts from '../../lib/posts'

import * as Layout from '../../layout/Default'

import * as Article from '../../components/Article'

function Post({ post }: { post: Posts.PostInfos }) {
  const Content = dynamic(() => import(`../../_posts/${post.fullName}.mdx`))

  return (
    <Article.Article metadata={post.metadata} createdAt={post.createdAt} content={<Content />} />
  )
}

function Page({
  page,
  posts
}: {
  page: number,
  posts: ReadonlyArray<Posts.PostInfos>,
}) {

  return (
    <div>
      <Head>
        <title>Posts - Page {page} - cerfeuil et musique douce</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout.Wrapper>
        {pipe(posts, ReadonlyArrayFP.map(post => <Post key={post.metadata.title} post={post} />))}
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps({
  params: {
    page,
  },
}: {
  params: {
    page: string,
  },
}) {
  const pageAsNumber = parseInt(page, 10)

  const postsMetadata = await Posts.getPostInfosForPage(pageAsNumber - 1)

  if (Option.isNone(postsMetadata)) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      page,
      posts: postsMetadata.value,
    },
  }
}

export async function getStaticPaths() {
  const pages = Posts.getPostFilenamesGroupedByPage()


  const paths = pipe(
    pages,
    ReadonlyArrayFP.mapWithIndex(index => {
      const page = index + 1

      return {
        params: {
          page: `${page}`,
        }
      }
    })
  );

  return {
    paths,
    fallback: false
  }
}

export default Page
