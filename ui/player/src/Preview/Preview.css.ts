import { style } from "@vanilla-extract/css";
import { vars, mediaQueries } from "@cmd/ui-theme";

export const preview = style({
  display: "grid",
  gridTemplateRows: `auto ${vars.sizes.s}`,
  gridTemplateColumns: "100%",
  gridTemplateAreas: `
    "content"
    "progress"
  `,
  height: "100%",
});

export const content = style({
  padding: vars.sizes.s,
  display: "grid",
  gridTemplateRows: `100%`,
  gridTemplateColumns:
    "fit-content(20%) fit-content(20%) auto fit-content(20%) fit-content(20%)",
  gridTemplateAreas: `
    "thumbnail leftButtons title rightButtons options"
  `,
  gridColumnGap: vars.sizes.s,
  backgroundColor: vars.colors.background,

  // "@media": {
  //   ...mediaQueries.forPhoneOnly({
  //     height: "8rem",
  //     gridTemplateRows: "auto auto",
  //     gridRowGap: vars.sizes.xs,
  //     gridTemplateColumns: "1fr 1fr",
  //     gridTemplateAreas: `
  //       "title title"
  //       "player options"
  //     `,
  //   }),
  // },
});

export const thumbnail = style({
  gridArea: "thumbnail",
  alignSelf: "stretch",
  justifySelf: "center",
  aspectRatio: "1 / 1",

  "@media": {
    ...mediaQueries.forPhoneOnly({
      display: "none",
    }),
  },
});

export const title = style({
  gridArea: "title",
  alignSelf: "center",
  justifySelf: "start",

  "@media": {
    ...mediaQueries.forPhoneOnly({
      justifySelf: "center",
      alignSelf: "end",
    }),
  },
});

export const leftButtons = style({
  gridArea: "leftButtons",
  alignSelf: "center",
});

export const rightButtons = style({
  gridArea: "rightButtons",
  alignSelf: "center",
});

export const commandBar = style({
  gridArea: "top",
  alignSelf: "center",
  justifySelf: "center",
  display: "grid",
  gridTemplateRows: "auto",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateAreas: `
    "leftCommand rightCommand"
  `,
  gridColumnGap: vars.sizes.xs,
});

export const commandPrev = style({
  gridArea: "leftCommand",
  justifySelf: "end",
  alignSelf: "center",
});

export const commandNext = style({
  gridArea: "rightCommand",
  justifySelf: "start",
  alignSelf: "center",
});

export const options = style({
  gridArea: "options",
  alignSelf: "center",
  justifySelf: "end",

  "@media": {
    ...mediaQueries.forPhoneOnly({
      alignSelf: "start",
    }),
  },
});

export const autoPlay = style({
  display: "grid",
  gridTemplateRows: "auto auto",
  gridTemplateColumns: "auto",
  gridTemplateAreas: `
    "button"
    "label"
  `,
  justifyItems: "center",
  gridColumnGap: vars.sizes.xs,
});

export const autoPlayLabel = style({
  gridArea: "label",
  alignSelf: "center",
  textAlign: "right",
});

export const autoPlayButton = style({
  gridArea: "button",
});

export const progress = style({
  gridArea: "progress",
  alignSelf: "stretch",
  justifySelf: "stretch",
  backgroundColor: vars.colors.background,
});
