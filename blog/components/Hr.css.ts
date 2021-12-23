import { style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css'

export const hr = style({
  margin: `${vars.sizes.m} 0`,
  border: 0,
  textAlign: 'center',
  color: vars.colors.grey,
})
