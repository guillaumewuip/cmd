import dynamic from 'next/dynamic'
import Head from 'next/head'

import { pipe } from 'fp-ts/function'
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray';

import * as Posts from '../lib/posts'
import * as RSS from '../lib/rss'

import * as Layout from '../layout/Default'

import * as Article from '../components/Article'

import { Paragraph, Code, H2 } from '../components/Text'
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
        <link rel="icon" href="/favicon.ico" />

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
            Tu comprends, je suis mon meilleur modèle car on est tous capables de donner des informations à chacun et c'est une sensation réelle qui se produit si on veut ! Tu vas te dire : J'aurais jamais cru que le karaté guy pouvait parler comme ça !
          </Paragraph>

          <Paragraph>
            Quand tu fais le calcul, je suis mon meilleur modèle car on est tous capables de donner des informations à chacun et c'est très, très beau d'avoir son propre moi-même ! Tu vas te dire : J'aurais jamais cru que le karaté guy pouvait parler comme ça !
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

            - Guillaume
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
