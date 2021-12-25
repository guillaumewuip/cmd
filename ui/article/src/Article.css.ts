import { style } from '@vanilla-extract/css';
import { mediaQueries } from '@cmd/ui-tokens'
import { vars } from '@cmd/ui-theme'

export const article = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto',
  gridTemplateAreas: `
    "title"
    "top"
    "bottom"
  `,

  padding: `${vars.sizes.l} 0`,
  marginBottom: `${vars.sizes.l}`,

  '@media': {
    ...mediaQueries.forDesktopOnly({
      gridTemplateColumns: '33% 67%',
      gridTemplateAreas: `
        "left title"
        "left right"
      `
    })

  }
});

export const title = style({
  gridArea: 'title',

  '@media': {
    ...mediaQueries.forDesktopOnly({
      paddingTop: vars.sizes.m,
      paddingLeft: vars.sizes.m,
    })
  }
})

export const left = style({
  gridArea: 'top',

  '@media': {
    ...mediaQueries.forDesktopOnly({
      paddingRight: vars.sizes.m,
      gridArea: 'left',
    })
  }
})

export const imageSection = style({
  marginBottom: vars.sizes.l,
})

export const imageContainer = style({
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

export const caption = style({
  textAlign: 'center'
})

export const right = style({
  gridArea: 'bottom',

  '@media': {
    ...mediaQueries.forDesktopOnly({
      paddingLeft: vars.sizes.m,
      gridArea: 'right',
    })
  }
})

export const metadata = style({
  width: '100%',
  marginTop: vars.sizes.s,
})
