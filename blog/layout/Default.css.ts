import { style } from '@vanilla-extract/css'
import { calc } from '@vanilla-extract/css-utils'
import { vars } from '../styles/theme.css'
import * as breakpoints from '../tokens/breakpoints'

export const main = style({
  overflow: 'hidden',
  padding: `${vars.sizes.xl} 0 ${vars.sizes.s}`,
})

export const wrapper = style({
  margin: '0 auto',
  width: '100%',
  maxWidth: breakpoints.maxContentWidth,
  padding: `0 ${vars.sizes.l}`,
})

export const smallSection = style({
  maxWidth: calc.multiply(breakpoints.maxContentWidth, 0.8),
  margin: '0 auto',
})
