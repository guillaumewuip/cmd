import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const mainTitle = style({
  fontFamily: vars.fonts.rubik,
  fontWeight: 700,
  letterSpacing: vars.sizes.xxs,
  fontSize: "2.6rem",
  lineHeight: "2.6rem",
  marginBottom: vars.sizes.s,
  color: vars.colors.dark,
});
