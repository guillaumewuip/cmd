import fs from 'fs'
import path from 'path'
import dynamic from 'next/dynamic'

import Head from 'next/head'

import * as Metadata from '../../lib/postMetadata'

import * as Layout from '../../layout/Default'

import * as Article from '../../components/Article'

import { H1 } from '../../components/Text'

function BlogPostPage({ slug, metadata }: { slug: string, metadata: Metadata.PostMetadata }) {
  const Content = dynamic(() => import(`../../_posts/${slug}.mdx`))

  return (
    <div>
      <Head>
        <title>{metadata.title} - cerfeuil et musique douce</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout.Wrapper>
        <Article.Wrapper>
          <Article.Image src={metadata.image.src} alt={metadata.image.alt} />

          <Article.Content>
            <H1>{metadata.title}</H1>

            <Content />
          </Article.Content>
        </Article.Wrapper>
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps({ params }: { params: { slug: string }}) {
  const { metadata } = await import(`../../_posts/${params.slug}.mdx`)

  return {
    props: {
      slug: params.slug,
      metadata,
    },
  }
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), '_posts')
  const mdxFiles = fs.readdirSync(postsDirectory)

  console.log('the queried pages', mdxFiles)

  const paths = mdxFiles.map(filename => ({
    params: {
      slug: filename.replace('.mdx', '')
    }
  }));

  return {
    paths,
    fallback: false
  }
}

export default BlogPostPage
