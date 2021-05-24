import Head from 'next/head'

import * as Layout from '../layout/Default'

import * as Article from '../components/Article'
import * as MusicEmbed from '../components/MusicEmbed'
import { Hr } from '../components/Hr'

import { MainTitle, Paragraph, H1, H2, Link } from '../components/Text'

export default function Home() {
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

        <Article.Wrapper>
          <Article.Image src="/images/marek.jpg" alt="toto" />

          <Article.Content>
            <H1>cmd#32</H1>

            <Paragraph>Salut les amis. Voici un petit paragraphe d'intro pour faire genre cette page a du contenu. Généralement je mets du <Link href="https://www.faux-texte.com/jean-claude-10.htm">Jean-Claude Van Damme</Link> mais cette fois ci je me suis décidé à changer un peu. C'est pas mal non ?</Paragraph>

            <H2>Paradise Deep Groove - I Love</H2>
            <Paragraph>Alors pour commencer sans plus attendre dans le vif du sujet on va s'écouter un peu de deep house parce que ce mois de Mai est bien dark et qu'il nous faut un track pour matcher ça. Zou on teste l'embed Bandcamp.</Paragraph>
            <MusicEmbed.Bandcamp album="3847376534" track="509184651" />

            <H2>Ziggy Zeitgeist & Erica Tucceri - Tzimtzum</H2>
            <Paragraph>On continue sans s'arrêter car on est des ouf et que malheuresement il n'y a pas que Bandcamp dans la vie ouais trop sad. Alors ici un petit track marrant trouvé sur Soundcloud tiens donc.</Paragraph>
            <MusicEmbed.Soundcloud track="824253793" />

            <H2>Laurent Garnier - 1-4 Doctor c'est chouette</H2>
            <Paragraph>Je serais pas surpris que de temps en temps il me faille partager des trucs qui viennent de Mixcloud. Non pas que le but soit de partager beaucoup de mixes mais sait-on jamais hein. Et puis Laurent Garnier publie des trucs là bas donc faudra bien pouvoir le montrer aux copains non mais ho. Aller on teste ça.</Paragraph>
            <MusicEmbed.Mixcloud feed="%2Flaurentgarnier%2Fwe-want-to-get-together-a-dj-mix-by-laurent-garnier-for-radio-meuh-circus-festival-2021%2F" />

            <H2>Prequel - I Still Love You</H2>
            <Paragraph>Encore un petit puis on va se coucher hein. Là cher lecteur tu te doute bien de ce qu'il va se passer. Le mec va-t-il réussir à se passer de player Youtube ? Que Neni. Faut bien suivre le mouvement. Aller vazy essaie moi ça.</Paragraph>
            <MusicEmbed.Youtube id="Zybuage4mvQ" />

            <Hr />

            <Paragraph>On est pas mal là avec nos 4 petits embed fait à la mano. Des fois faut pas se compliquer la vie et aller chercher des libs pour tous hein. Aller bonne nuit</Paragraph>

          </Article.Content>
        </Article.Wrapper>
      </Layout.Wrapper>
    </div>
  )
}
