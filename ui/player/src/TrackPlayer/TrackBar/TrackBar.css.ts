import { style } from "@vanilla-extract/css";
import { vars, mediaQueries } from "@cmd/ui-theme";

export const barHeight = "9rem";

const bar = style({
  display: "grid",
  width: "100%",
  minHeight: barHeight,
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
    marginTop: vars.sizes.s,
    marginBottom: vars.sizes.xl,
    gridTemplateRows: "1fr 2fr 2fr 1fr",
    gridTemplateColumns: `${barHeight} minmax(${barHeight}, 1fr) 7fr minmax(${barHeight}, 1fr)`,
    gridTemplateAreas: `
      "thumbnail command top source"
      "thumbnail command title source"
      "thumbnail command title source"
      "thumbnail command bottom source"
    `,

    "@media": {
      ...mediaQueries.forPhoneOnly({
        gridTemplateRows: "auto auto auto",
        gridTemplateColumns: `1fr 3fr 1fr`,
        gridGap: vars.sizes.s,
        gridTemplateAreas: `
          "thumbnail thumbnail thumbnail"
          "command   title     title"
          "source    source    source"
        `,
      }),
    },
  },
]);

export const thumbnail = style({
  gridArea: "thumbnail",
  justifySelf: "stretch",
  alignSelf: "center",
});

export const command = style({
  gridArea: "command",
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
      borderColor: vars.colors.buttonBackground,
    },
  },
});

export const svg = style({
  height: `calc(${barHeight} * 0.6)`,
  width: `calc(${barHeight} * 0.6)`,
  padding: `calc(${barHeight} * 0.1)`,
  fill: vars.colors.buttonBackground,
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
      "thumbnail command top source"
      "thumbnail command title source"
      "thumbnail command progress source"
      "thumbnail command bottom source"
    `,

    "@media": {
      ...mediaQueries.forPhoneOnly({
        gridTemplateAreas: `
          "thumbnail thumbnail thumbnail"
          "command   title     title"
          "progress  progress  source"
        `,
      }),
    },
  },
]);

export const progress = style({
  gridArea: "progress",
  alignSelf: "center",
});

export const source = style({
  gridArea: "source",
  alignSelf: "center",
  justifySelf: "end",
});
