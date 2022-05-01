import { style } from "@vanilla-extract/css";

export const barHeight = "7rem";

export const abortedBar = style({
  display: "grid",
  width: "100%",
  height: barHeight,
  gridTemplateRows: "auto",
  gridTemplateColumns: "auto",
  gridTemplateAreas: '"centered"',
});

export const abortedBarMessage = style({
  gridArea: "centered",
  justifySelf: "center",
  alignSelf: "center",
});
