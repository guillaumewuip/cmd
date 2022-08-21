import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const footer = style({
  marginTop: vars.sizes.m,
  marginBottom: "6rem",
  textAlign: "center",
});

export const select = style({
  fontFamily: vars.fonts.rubik,
  border: "none",
  color: vars.colors.accent,
});
