import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const barHeight = "7rem";

const bar = style({
  display: "grid",
  width: "100%",
  height: barHeight,
});

export const abortedBar = style([
  bar,
  {
    gridTemplateRows: "auto",
    gridTemplateColumns: "auto",
    gridTemplateAreas: '"centered"',
  },
]);

export const abortedBarMessage = style({
  gridArea: "centered",
  justifySelf: "center",
  alignSelf: "center",
});

export const notSelectedBar = style([
  bar,
  {
    gridTemplateRows: "1fr 2fr 2fr 1fr",
    gridTemplateColumns: `minmax(${barHeight}, 1fr) 7fr minmax(${barHeight}, 1fr)`,
    gridTemplateAreas: `
      "left top right"
      "left title right"
      "left title right"
      "left bottom right"
    `,
  },
]);

export const command = style({
  gridArea: "left",
  justifySelf: "center",
  alignSelf: "center",
});

export const commandButton = style({
  background: "none",
  color: "inherit",
  border: `1px solid transparent`,
  outline: "inherit",
  borderRadius: "200000px",
  padding: "0.5rem",
  height: `calc(${barHeight} * 0.7)`,
  width: `calc(${barHeight} * 0.7)`,

  selectors: {
    "&:hover": {
      cursor: "pointer",
      borderColor: vars.colors.dark,
    },
  },
});

export const svg = style({
  height: `calc(${barHeight} * 0.6)`,
  width: `calc(${barHeight} * 0.6)`,
  padding: `calc(${barHeight} * 0.1)`,
  fill: vars.colors.dark,
});

export const svgLoading = style([svg]);

export const title = style({
  gridArea: "title",
  justifySelf: "left",
  alignSelf: "center",
});

export const selectedBar = style([
  notSelectedBar,
  {
    gridTemplateAreas: `
      "left top right"
      "left title right"
      "left progress right"
      "left bottom right"
    `,
  },
]);

export const progress = style({
  gridArea: "progress",
  alignSelf: "center",
});

export const source = style({
  gridArea: "right",
  alignSelf: "center",
  justifySelf: "end",
});
