import dynamic from 'next/dynamic'
import Head from 'next/head'

import { NextSeo } from 'next-seo';

import { pipe } from 'fp-ts/function'
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';

import * as Posts from '../lib/posts'
import * as RSS from '../lib/rss'

import * as Layout from '../layout/Default'

import * as Article from '../components/Article'

import { Link } from '../components/Text'
import { Paragraph, Code, H2 } from '@cmd/ui-components-text'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Hr } from '../components/Hr'
import { Mosaic } from '../components/ArticleMosaic'

import * as Metadata from '../metadata'

export default function Home({
  lastCmd,
  previousCmds,
}: {
  lastCmd: Posts.PostInfos
  previousCmds: ReadonlyArray<Posts.PostInfos>
}) {
  const PostContent = dynamic(() => import(`../_posts/${lastCmd.fullName}.mdx`))

  const imageUrl = `${Metadata.site.url}${lastCmd.metadata.image.src}`

  return (
    <div>
      <Head>
        <title>{Metadata.site.name}</title>
      </Head>

      {/* @ts-ignore */}
      <NextSeo
        openGraph={{
          images: [{ url: imageUrl}]
        }}
      />

      <Layout.Wrapper>
        <Layout.SmallSection>
          <Header />
          <Paragraph>
            Hello ! Et bienvenue sur cerfeuil et musique douce a.k.a. <Code>cmd</Code> pour les intimes. Ici je partage régulièrement la bonne musique que je découvre au quotidien sur les internets et ailleurs (et oui, parfois en vrai avec de vrais gens et de vrais sons, c'est incroyable).
          </Paragraph>

          <Paragraph>
            On y trouve principalement de l'électro, de l'ambient, de la techno, de l'experimental mais aussi du funk, de la synth-pop, de la disco, du rock, etc. Bref, un peu toute musique chouette dénichée à droite à gauche. À déguster avec une bonne part de <Link href="https://www.instagram.com/mmpsev/">tarte au cerfeuil</Link> (d'où le nom).
          </Paragraph>

          <Paragraph>Sans plus attendre, la dernière <Code>cmd</Code>, vous m'en direz des nouvelles :</Paragraph>
        </Layout.SmallSection>

        <Article.Article metadata={lastCmd.metadata} createdAt={lastCmd.createdAt} content={<PostContent />} />

        <Layout.SmallSection>
          <H2>Toutes les <Code>cmd</Code> passées listées bien comme il faut ici même :</H2>

          <Mosaic posts={previousCmds} />

          <Hr />

          <Paragraph>
            Voilà, c'est tout pour aujourd'hui, merci d'être passé !
            <br /><br />

            Guillaume
          </Paragraph>

          <Footer />
        </Layout.SmallSection>
      </Layout.Wrapper>
    </div>
  )
}

export async function getStaticProps() {
  await RSS.generateFeeds()

  const lastCmd = await Posts.getLastPostInfos()
  const previousCmds = await Posts.getAllPostInfos()

  return {
    props: {
      lastCmd: lastCmd.infos,
      previousCmds: pipe(
        previousCmds,
        ReadonlyArrayFP.map(post => post.infos)
      ),
    },
  }
}