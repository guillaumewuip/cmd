import dynamic from 'next/dynamic'
import Head from 'next/head'

import { pipe } from 'fp-ts/function'
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';

import * as Posts from '../lib/posts'
import * as RSS from '../lib/rss'

import * as Layout from '../layout/Default'

import * as Article from '../components/Article'

import { Paragraph, Code, H2, Link } from '../components/Text'
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

  return (
    <div>
      <Head>
        <title>{Metadata.site.name}</title>
        <link rel="icon" href="/favicon.png" />

        <meta name="author" content={Metadata.author.name} />
        <meta name="description" content={Metadata.description} />

        <meta name="twitter:creator" content={Metadata.author.twitter.id} />
        <meta name="twitter:description" content={Metadata.description} />
        <meta name="twitter:card" content="summary" />
        <meta property="twitter:title" content={Metadata.site.name} />

        <meta property="og:site_name" content={Metadata.site.name} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:url" content={Metadata.site.url} />
        <meta property="og:description" content={Metadata.description} />

        <link rel="canonical" href={Metadata.site.url} />

        <script type="application/ld+json">
          {'{'}
            "@type": "WebSite",
            "@context": "https://schema.org"
            "headline": "{Metadata.site.name}",
            "description": "{Metadata.description}",
            "url": "{Metadata.site.url}",
            "name": "{Metadata.site.name}",
          {'}'}
        </script>

        <link type="application/atom+xml" rel="alternate" href="https://cmd.wuips.com/rss/feed.xml" title={Metadata.site.name} />
      </Head>

      <Layout.Wrapper>
        <Layout.SmallSection>
          <Header />
          <Paragraph>
            Hello ! Et bienvenue sur cerfeuil et musique douce a.k.a. <Code>cmd</Code> pour les intimes. Ici je tente de partager régulièrement la bonne musique que je découvre au quotidien sur les internets et ailleurs.
          </Paragraph>

          <Paragraph>
            On y trouve principalement de l'électro, de l'ambient, de la techno, de l'experimental mais aussi du funk, de la synth-pop, de la disco, du rock, etc. Bref, un peu toute musique chouette dénichée à droite à gauche. À déguster avec une bonne part de <Link href="https://www.instagram.com/mmpsev/">tarte au cerfeuil</Link>, bien goulûment.
          </Paragraph>

          <Paragraph>Sans plus attendre, la dernière <Code>cmd</Code> :</Paragraph>
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
