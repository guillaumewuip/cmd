import dynamic from 'next/dynamic'
import Head from 'next/head'

import * as Metadata from '../lib/postMetadata'
import * as Filename from '../lib/postFilename'
import * as Posts from '../lib/posts'

import * as Layout from '../layout/Default'

import * as Article from '../components/Article'

import { MainTitle, Paragraph, H1, H2, Link } from '../components/Text'

export default function Home({
  fullName,
  metadata,
  createdAt,
}: {
  fullName: string,
  metadata: Metadata.PostMetadata,
  createdAt: string,
}) {
  const PostContent = dynamic(() => import(`../_posts/${fullName}.mdx`))

  return (
    <div>
      <Head>
        <title>cmd - cerfeuil et musique douce</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout.Wrapper>
        <Layout.SmallSection>
          <MainTitle>cerfeuil et musique douce</MainTitle>
          <Paragraph>
            Tu comprends, je suis mon meilleur modèle car on est tous capables de donner des informations à chacun et c'est une sensation réelle qui se produit si on veut ! Tu vas te dire : J'aurais jamais cru que le karaté guy pouvait parler comme ça !
          </Paragraph>

          <Paragraph>
            Quand tu fais le calcul, je suis mon meilleur modèle car on est tous capables de donner des informations à chacun et c'est très, très beau d'avoir son propre moi-même ! Tu vas te dire : J'aurais jamais cru que le karaté guy pouvait parler comme ça !
          </Paragraph>
        </Layout.SmallSection>

        <Article.Article metadata={metadata} createdAt={createdAt} content={<PostContent />} />
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps() {
  const lastPostFilename = Posts.getLastPostFilename()
  const fullName = Filename.fullNameFromFilename(lastPostFilename)

  console.log({ fullName });

  const { metadata, createdAt } = await Posts.getPostInfosFromFullname(fullName)

  return {
    props: {
      fullName,
      metadata,
      createdAt,
    },
  }
}
