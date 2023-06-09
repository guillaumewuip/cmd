import { style } from "@vanilla-extract/css";

// TODO without this, Vanilla Extract styles are not embeded in the given page
export const fix = style({
  display: "none",
});
