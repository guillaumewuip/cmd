import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const footer = style({
  marginTop: vars.sizes.l,
  textAlign: "center",
});

export const select = style({
  fontFamily: vars.fonts.text,
  border: "none",
  color: vars.colors.accent,
});
