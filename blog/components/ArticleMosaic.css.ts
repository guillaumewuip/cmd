import { style } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css'
import { forDesktopOnly } from '../tokens/media-queries'

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(auto-fit, auto)',
  columnGap: vars.sizes.m,
  rowGap: vars.sizes.m,

  margin: `${vars.sizes.s} 0`,

  '@media': {
    ...forDesktopOnly({
      gridTemplateColumns: 'repeat(5, 1fr)',
    })
  }
})

export const article = style({
  display: 'block',
  position: 'relative',

  width: '100%',
  marginBottom: vars.sizes.xs,

  selectors: {
    '&::after': {
      content: "",
      display: 'block',
      paddingBottom: '100%',
    }
  }
})

export const overlay = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: vars.colors.dark,
  opacity: 0.2,

  selectors: {
    [`${article}:hover &`]: {
      opacity: 0.5,
    }
  }
})

export const title = style({
  position: 'absolute',
  textAlign: 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
})
