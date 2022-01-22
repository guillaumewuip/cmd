import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { vars, mediaQueries } from '@cmd/ui-theme'

export const commandButton = style({
  display: 'grid',
  gridTemplateRows: 'auto',
  gridTemplateColumns: 'auto',
  gridTemplateAreas: '"content"',
  background: 'none',
	color: 'inherit',
  border: `1px solid transparent`,
	outline: 'inherit',
  borderRadius: '200000px',
  textAlign: 'center',

  height: calc.multiply(vars.sizes.m, 2),
  width: calc.multiply(vars.sizes.m, 2),
  padding: vars.sizes.xs,

  selectors: {
    '&:hover, &:focus': {
      cursor: 'pointer',
      borderColor: vars.colors.dark,
    },

    '&:active': {
      backgroundColor: vars.colors.dark,
    }
  },

  '@media': {
    ...mediaQueries.forDesktopOnly({
      height: calc.multiply(vars.sizes.m, 3),
      width: calc.multiply(vars.sizes.m, 3),
      padding: vars.sizes.s,
    })
  }
})

export const svg = style({
  gridArea: 'content',
  alignSelf: 'center',
  justifySelf: 'center',
  fill: vars.colors.dark,

  selectors: {
    [`${commandButton}:active &`]: {
      fill: vars.colors.white,
    }
  }
})

export const svgLoading = style([
  svg,
  {
    height: calc.multiply(vars.sizes.m, 3),
    width: calc.multiply(vars.sizes.m, 3),
    padding: vars.sizes.s,
  }
])

export const medium = style({
  height: calc.multiply(vars.sizes.m, 2),
  width: calc.multiply(vars.sizes.m, 2),
  padding: vars.sizes.xs,
})

export const small = style({
  height: calc.multiply(vars.sizes.m, 1),
  width: calc.multiply(vars.sizes.m, 1),
  padding: calc.divide(vars.sizes.xs, 2),
})

