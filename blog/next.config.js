const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

const withMDX = require('@next/mdx')({
  extension: /\.mdx$/
})

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
