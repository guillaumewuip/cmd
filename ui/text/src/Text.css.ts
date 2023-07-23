import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const paragraph = style({
  fontFamily: vars.fonts.headingLight,
  fontWeight: 400,
  fontSize: "1rem",
  lineHeight: "1.25rem",
  marginBottom: vars.sizes.xs,
  color: vars.colors.text,
  maxWidth: "960px", // TODO theme
});

export const small = style({
  fontFamily: vars.fonts.text,
  fontWeight: 400,
  fontSize: "0.8rem",
  lineHeight: "1rem",
  color: vars.colors.dimmedText,
});

export const monospace = style([
  small,
  {
    fontVariantNumeric: "tabular-nums",
  },
]);

export const a = style({
  color: vars.colors.accent,

  selectors: {
    "&:visited": {
      color: vars.colors.accent,
    },

    "&:hover": {
      textDecoration: "none",
    },

    "&:active": {
      opacity: 0.5,
    },
  },
});

export const h1 = style({
  fontFamily: vars.fonts.heading,
  fontWeight: 700,
  fontSize: "4.2rem",
  lineHeight: "5rem",
  marginBottom: vars.sizes.l,
  color: vars.colors.title,
});

export const h2 = style({
  fontFamily: vars.fonts.headingLight,
  fontWeight: 700,
  fontSize: "1.3rem",
  lineHeight: "1.5rem",
  marginTop: vars.sizes.l,
  marginBottom: vars.sizes.xs,
  color: vars.colors.title,
});

export const h3 = style({
  fontFamily: vars.fonts.headingLight,
  fontWeight: 400,
  fontSize: "1rem",
  lineHeight: "1.1rem",
  marginTop: 0,
  marginBottom: vars.sizes.s,
  color: vars.colors.subTitle,
});

export const inverted = style({
  color: vars.colors.invertedText,
});

export const noMargin = style({
  margin: 0,
});

export const blockquote = style({
  paddingTop: "1rem",
  textAlign: "center",
});

export const code = style({
  fontFamily: vars.fonts.headline,
  fontWeight: 500,
});

export const columnHeader = style({
  fontFamily: vars.fonts.headline,
  fontWeight: 700,
  fontSize: "1.5rem",
  lineHeight: "1.8rem",
  color: vars.colors.title,
  textAlign: "center",
});
