import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const hr = style({
  margin: `${vars.sizes.m} 0`,
  border: 0,
  textAlign: "center",
  color: vars.colors.grey,
});
