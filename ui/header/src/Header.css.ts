import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const link = style({
  color: vars.colors.title,
  textDecoration: "none",

  selectors: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
});
