import { createTheme } from '@vanilla-extract/css';

import {
  breakpoints,
  sizes,
  colors,
} from '@cmd/tokens'

export const [theme, vars] = createTheme({
  breakpoints,
  sizes,
  colors,
});
