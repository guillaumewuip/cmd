import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const link = style({
  display: "block",
  fontFamily: vars.fonts.headline,
  fontWeight: 900,
  padding: `${vars.sizes.s} 0`,
  width: "14rem", // TODO theme
  fontSize: "6rem", // fit best with height value
  color: vars.colors.title,
  textDecoration: "none",

  selectors: {
    "&:hover": {
      color: vars.colors.background,
      backgroundColor: vars.colors.separator,
    },
  },
});
