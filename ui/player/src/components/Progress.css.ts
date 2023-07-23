import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const wrapper = style({
  display: "grid",
  gridTemplateRows: "auto",
  gridTemplateColumns: "max-content auto max-content",
  gridTemplateAreas: `
    "left center right"
  `,
  gridColumnGap: vars.sizes.xs,
});

export const timeLeft = style({
  gridArea: "left",
  alignSelf: "center",
});

export const timeRight = style({
  gridArea: "right",
  alignSelf: "center",
});
