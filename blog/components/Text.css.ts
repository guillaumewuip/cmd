import { style, globalStyle } from '@vanilla-extract/css';
import { fonts } from '@cmd/tokens'
import { vars } from '@cmd/theme'

export const paragraph = style({
  fontFamily: fonts.rubik,
  fontWeight: 400,
  fontSize: '1rem',
  lineHeight: '1.5rem',
  marginBottom: vars.sizes.xs,
  color: vars.colors.dark,
})

export const small = style({
  fontFamily: fonts.rubik,
  fontWeight: 400,
  fontSize: '0.8rem',
  lineHeight: '1rem',
  color: vars.colors.grey,
})

export const mainTitle = style({
  fontFamily: 'Rubik, Courier, sans-serif',
  fontWeight: 700,
  letterSpacing: vars.sizes.xxs,
  fontSize: '2.6rem',
  lineHeight: '2.6rem',
  marginBottom: vars.sizes.s,
  color: vars.colors.dark,
})

export const a = style({
  color: vars.colors.green,

  selectors: {
    '&:visited': {
      color: vars.colors.green,
    },

    '&:hover': {
      textDecoration: 'none',
    },

    '&:active': {
      opacity: 0.5,
    }
  }
})

export const h1 = style({
  fontFamily: fonts.rubik,
  fontWeight: 600,
  fontSize: '2.2rem',
  lineHeight: '2.4rem',
  marginTop: vars.sizes.m,
  marginBottom: vars.sizes.l,
  color: vars.colors.dark,
})

export const h2 = style({
  fontFamily: fonts.rubik,
  fontWeight: 600,
  fontSize: '1.3rem',
  lineHeight: '1.5rem',
  marginTop: vars.sizes.l,
  marginBottom: vars.sizes.xs,
  color: vars.colors.dark,
})

export const h3 = style({
  fontFamily: fonts.rubik,
  fontWeight: 400,
  fontSize: '1rem',
  lineHeight: '1.1rem',
  marginTop: 0,
  marginBottom: vars.sizes.s,
  color: vars.colors.grey,
})

export const centered = style({
  textAlign: 'center'
})

export const inverted = style({
  color: vars.colors.white,
})

export const noMargin = style({
  margin: 0,
})

export const code = style({
  fontFamily: 'Courier, monospace',
})

export const blockquote = style({
  paddingTop: '1rem',
  paddingLeft: '1rem',
})

globalStyle(`${blockquote} > *`, {
  textAlign: 'center',
})
