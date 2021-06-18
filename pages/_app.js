import '../styles/globals.scss'

import { MDXProvider } from '@mdx-js/react'

import { H1, H2, H3, Link, Paragraph, Code } from '../components/Text'
import { Hr } from '../components/Hr'

const mdComponents = {
  h1: props => <H1 {...props} />,
  h2: props => <H2 {...props} />,
  h3: props => <H3 {...props} />,
  a: props => <Link {...props} />,
  p: props => <Paragraph {...props} />,
  hr: () => <Hr  />,
  code: props => <Code {...props} />,
}

function MyApp({ Component, pageProps }) {
  return (
    <MDXProvider components={mdComponents}>
      <Component {...pageProps} />
    </MDXProvider>
  )
}

export default MyApp
