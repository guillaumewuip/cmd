import fs from 'fs'
import path from 'path'
import dynamic from 'next/dynamic'

import Head from 'next/head'

import { format as formatDate } from 'date-fns'

import * as Metadata from '../../lib/postMetadata'
import * as Filename from '../../lib/postFilename'

import * as Layout from '../../layout/Default'

import * as Article from '../../components/Article'

function BlogPostPage({
  slug,
  metadata,
  createdAt,
}: {
  slug: string,
  metadata: Metadata.PostMetadata,
  createdAt: string,
}) {
  const Content = dynamic(() => import(`../../_posts/${slug}.mdx`))

  return (
    <div>
      <Head>
        <title>{metadata.title} - cerfeuil et musique douce</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout.Wrapper>
        <Article.Wrapper>
          <Article.Column>
            <Article.Image src={metadata.image.src} alt={metadata.image.alt} caption={metadata.image.caption} />
          </Article.Column>

          <Article.Content>
            <Article.Header title={metadata.title} date={createdAt} />
            <Content />
          </Article.Content>
        </Article.Wrapper>
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string }}) {
  const { metadata } = await import(`../../_posts/${slug}.mdx`)

  const date = Filename.dateFromFilename(slug)

  return {
    props: {
      slug: slug,
      metadata,
      createdAt: formatDate(date, 'dd-MM-Y'),
    },
  }
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), '_posts')
  const mdxFiles = fs.readdirSync(postsDirectory)

  const paths = mdxFiles
    .map(filename => ({
      slug: Filename.fullNameFromFilename(filename),
      date: Filename.dateFromFilename(filename),
    }))
    .sort((data1, data2) => data1.date.getDate() - data2.date.getDate())
    .map(data => ({
      params: {
        slug: data.slug
      }
    }))

  return {
    paths,
    fallback: false
  }
}

export default BlogPostPage
