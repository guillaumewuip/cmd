import Head from 'next/head'

import { pipe } from 'fp-ts/function';
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';

import * as Posts from '../../lib/posts'

import * as Layout from '../../layout/Default'

import { Header } from '../../components/Header'
import { H2 } from '../../components/Text'
import { Link, Paragraph} from '../../components/Text';

function Post({ post }: { post: Posts.PostInfos }) {

  return (
    <H2><Link href={`/post/${post.fullName}`}>{post.metadata.title}</Link></H2>
  )
}

function Page({
  page,
  posts,
  previous,
  next,
}: {
  page: string,
  posts: ReadonlyArray<Posts.PostInfos>,
  previous: Option.Option<number>,
  next: Option.Option<number>,
}) {

  return (
    <div>
      <Head>
        <title>Posts - Page {page} - cerfeuil et musique douce</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout.Wrapper>
        <Header />

        {pipe(posts, ReadonlyArrayFP.map(post => <Post key={post.metadata.title} post={post} />))}

        {(Option.isSome(previous) || Option.isSome(next)) && (
          <>
            <Paragraph centered>
              { Option.isSome(previous) && <Link href={`/posts/${previous.value}`}>← Les posts plus récents</Link> }
            </Paragraph>

            <Paragraph centered>
              { Option.isSome(next) && <Link href={`/posts/${next.value}`}>Les posts plus vieux →</Link> }
            </Paragraph>
          </>
        )}
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

  const previous = Posts.previousPage(pageAsNumber)
  const next = Posts.nextPage(pageAsNumber)

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
      previous,
      next
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
