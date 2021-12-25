import { createTheme } from '@vanilla-extract/css';

import {
  breakpoints,
  sizes,
  colors,
} from '@cmd/tokens'

import { MapLeafNodes, CSSVarFunction } from '@vanilla-extract/private';

const tokens = {
  breakpoints,
  sizes,
  colors,
}

export const [
  themeClassName,
  vars,
]: [
  string,
  // Need this because TS is lost with how pnpm stores libs
  MapLeafNodes<typeof tokens, CSSVarFunction>
] = createTheme(tokens);
