import { style } from '@vanilla-extract/css'
import { calc } from '@vanilla-extract/css-utils'
import { vars } from '@cmd/ui-theme'

export const main = style({
  overflow: 'hidden',
  padding: `${vars.sizes.xl} 0 ${vars.sizes.s}`,
})

export const wrapper = style({
  margin: '0 auto',
  width: '100%',
  maxWidth: vars.breakpoints.maxContentWidth,
  padding: `0 ${vars.sizes.l}`,
})

export const smallSection = style({
  maxWidth: calc.multiply(vars.breakpoints.maxContentWidth, 0.8),
  margin: '0 auto',
})
