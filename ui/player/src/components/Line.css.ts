import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const svg = style({
  gridArea: "center",
  alignSelf: "center",
  width: "100%",
  height: "100%",
});

export const backgroundLine = style({
  stroke: vars.colors.dimmedSeparator,
  strokeWidth: 3,
});

export const activeLine = style({
  stroke: vars.colors.separator,
  strokeWidth: 5,
});
