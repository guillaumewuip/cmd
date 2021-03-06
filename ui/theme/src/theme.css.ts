import { createTheme } from "@vanilla-extract/css";

import { breakpoints, sizes, colors, fonts } from "@cmd/ui-tokens";

import { MapLeafNodes, CSSVarFunction } from "@vanilla-extract/private";

const tokens = {
  breakpoints,
  sizes,
  colors,
  fonts,
};

export const [themeClassName, vars]: [
  string,
  // Need this because TS is lost with how pnpm stores libs
  MapLeafNodes<typeof tokens, CSSVarFunction>
] = createTheme(tokens);
