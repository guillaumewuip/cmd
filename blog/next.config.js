const mdx = require('@next/mdx')
const { default: remarkEmbedder } = require('@remark-embedder/core')

const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const MusicPlayerTransformer = {
  name: 'MusicPlayer',
  shouldTransform() {
    return true
  },
  getHTML(url) {
    return `<player href="${url}"></player>`
  },
}

const withMDX = mdx({
  extension: /\.mdx$/,
  options: {
    remarkPlugins: [
      [remarkEmbedder, { transformers: [MusicPlayerTransformer]}],
    ]
  }
})

const withVanillaExtract = createVanillaExtractPlugin();

module.exports = withVanillaExtract(
  withMDX(
    {
      pageExtensions: ['js', 'jsx', 'tsx', 'mdx'],
      i18n: {
        locales: ["fr-FR"],
        defaultLocale: "fr-FR",
      },
    },
  ),
)
