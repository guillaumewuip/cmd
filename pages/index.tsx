import dynamic from 'next/dynamic'
import Head from 'next/head'

import * as Posts from '../lib/posts'

import * as Layout from '../layout/Default'

import * as Article from '../components/Article'

import { MainTitle, Paragraph, Code, H2 } from '../components/Text'
import { Mosaic } from '../components/ArticleMosaic'

export default function Home({
  lastCmd,
  previousCmds,
}: {
  lastCmd: Posts.PostInfos
  previousCmds: ReadonlyArray<Posts.PostInfos>
}) {
  const PostContent = dynamic(() => import(`../_posts/${lastCmd.fullName}.mdx`))

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

          <Paragraph>Sans plus attendre, la dernière <Code>cmd</Code> :</Paragraph>
        </Layout.SmallSection>

        <Article.Article metadata={lastCmd.metadata} createdAt={lastCmd.createdAt} content={<PostContent />} />

        <Layout.SmallSection>
          <H2>Toutes les <Code>cmd</Code> passées listées bien comme il faut ici même, voilà :</H2>

          <Mosaic posts={previousCmds} />
        </Layout.SmallSection>
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps() {
  const lastCmd = await Posts.getLastPostInfos()
  const previousCmds = await Posts.getPreviousPostInfos()

  return {
    props: {
      lastCmd,
      previousCmds,
    },
  }
}
