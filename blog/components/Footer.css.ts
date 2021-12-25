import { style } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css'

export const footer = style({
  marginTop: vars.sizes.m,
  marginBottom: vars.sizes.l,
  textAlign: 'center',
})
