import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const link = style({
  display: "grid",
  justifyItems: "stretch",
  alignItems: "stretch",

  width: "100%",
  height: "100%",
  fontFamily: vars.fonts.headline,
  fontWeight: 900,
  fontSize: "3.3rem", // TODO theme
  color: vars.colors.title,
  textDecoration: "none",
  padding: vars.sizes.s,

  selectors: {
    "&:hover": {
      color: vars.colors.background,
      backgroundColor: vars.colors.separator,
    },
  },
});

export const text = style({
  transform: "rotate(-180deg)",
  writingMode: "vertical-rl",
});
