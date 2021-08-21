const withMDX = require('@next/mdx')({
  extension: /\.mdx$/
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'tsx', 'mdx'],
  future: {
    webpack5: true,
  },
  i18n: {
    locales: ["fr-FR"],
    defaultLocale: "fr-FR",
  },
})
