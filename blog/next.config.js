// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");

const withVanillaExtract = createVanillaExtractPlugin();

module.exports = withVanillaExtract({
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    // To fix "Module not found: Can't resolve 'canvas'" error
    // eslint-disable-next-line no-param-reassign
    config.externals = [...config.externals, "canvas", "jsdom"];

    return config;
  },
});
