import dynamic from 'next/dynamic'
import Head from 'next/head'

import { NextSeo } from 'next-seo';

import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function'

import { Infos } from '@cmd/domain-post'

import { Article, Mosaic } from '@cmd/ui-article'
import * as Layout from '@cmd/ui-layout'
import { Paragraph, Code, H2, Link, Hr } from '@cmd/ui-text'
import { Header } from '@cmd/ui-header'
import { Footer } from '@cmd/ui-footer'

import { Metadata } from '@cmd/domain-metadata'
import { generateFeeds } from '@cmd/domain-rss'

import {
  getLastPostInfos,
  getAllPostInfos,
} from '../posts'

import * as SiteMetadata from '../metadata'

type Cmd = {
  href: string,
  metadata: Metadata.Cmd
}

export default function Home({
  lastCmd,
  previousCmds,
}: {
  lastCmd: Infos.Infos
  previousCmds: ReadonlyArray<Cmd>
}) {
  const PostContent = dynamic(() => import(`../_posts/${lastCmd.fullName}.mdx`))

  const imageUrl = `${SiteMetadata.site.url}${lastCmd.metadata.image.src}`

  return (
    <div>
      <Head>
        <title>{SiteMetadata.site.name}</title>
      </Head>

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

        <Article metadata={lastCmd.metadata} createdAt={lastCmd.createdAt} content={<PostContent />} />

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
  const lastCmd = await getLastPostInfos()
  const previousCmds = await getAllPostInfos()

  await generateFeeds(previousCmds, {
    outputDir: './public/rss'
  })

  const cmds: ReadonlyArray<Cmd> = pipe(
    previousCmds,
    ReadonlyArrayFP.map(post => ({
      href: `/post/${post.infos.fullName}`,
      metadata: post.infos.metadata
    }))
  )

  return {
    props: {
      lastCmd: lastCmd.infos,
      previousCmds: cmds,
    },
  }
}
