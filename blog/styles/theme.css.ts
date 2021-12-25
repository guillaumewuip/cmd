import { createTheme } from '@vanilla-extract/css';

import * as breakpoints from '../tokens/breakpoints'
import * as sizes from '../tokens/sizes'
import * as colors from '../tokens/colors'

export const [theme, vars] = createTheme({
  breakpoints,
  sizes,
  colors,
});
