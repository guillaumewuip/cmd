import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const list = style({
  listStyleType: "none",
  paddingLeft: 0,
  textAlign: "right",
});

export const item = style({
  display: "inline-block",

  padding: `0 ${vars.sizes.xs} 0 0`,

  selectors: {
    [`& + &:before`]: {
      content: '"-"',
      display: "inline-block",
      marginRight: vars.sizes.xs,
    },
  },
});

export const active = style({
  color: vars.colors.dimmedText,
});

export const itemContent = style({
  fontFamily: vars.fonts.rubik,
  fontWeight: 400,
  lineHeight: "1rem",
  color: vars.colors.text,
  textDecoration: "none",

  selectors: {
    [`${active} &`]: { color: vars.colors.dimmedText },
    [`${item}:not(${active}):hover &`]: {
      textDecoration: "underline",
    },
  },
});
