import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css'

export const link = style({
  color: vars.colors.dark,
  textDecoration: 'none',

  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
  }

})
