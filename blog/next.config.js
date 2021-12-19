const withMDX = require('@next/mdx')({
  extension: /\.mdx$/
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'tsx', 'mdx'],
  i18n: {
    locales: ["fr-FR"],
    defaultLocale: "fr-FR",
  },
})
