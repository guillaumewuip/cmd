import { style } from "@vanilla-extract/css";
import { vars, mediaQueries } from "@cmd/ui-theme";

export const preview = style({
  height: "14rem", // TODO theme
  padding: `${vars.sizes.s}`,
  display: "grid",
  gridTemplateRows: "auto auto fit-content(50%)",
  gridTemplateColumns:
    "min-content minmax(8rem, 20rem) auto minmax(8rem, 20rem)",
  gridTemplateAreas: `
    "thumbnail title none options"
    "thumbnail player none options"
    "progress progress progres"
  `,
  gridColumnGap: vars.sizes.s,
  backgroundColor: vars.colors.background,

  "@media": {
    ...mediaQueries.forPhoneOnly({
      height: "8rem",
      gridTemplateRows: "auto auto",
      gridRowGap: vars.sizes.xs,
      gridTemplateColumns: "1fr 1fr",
      gridTemplateAreas: `
        "title title"
        "player options"
      `,
    }),
  },
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

export const text = style({
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

export const player = style({
  gridArea: "player",
  alignSelf: "center",
  justifySelf: "stretch",
  display: "grid",
  gridTemplateRows: "2fr 1fr",
  gridTemplateColumns: "auto",
  gridTemplateAreas: `
    "top"
    "bottom"
  `,

  "@media": {
    ...mediaQueries.forPhoneOnly({
      justifySelf: "start",
      alignSelf: "start",
      gridTemplateAreas: `
        "top"
        "top"
      `,
    }),
  },
});

export const commandBar = style({
  gridArea: "top",
  alignSelf: "center",
  justifySelf: "center",
  display: "grid",
  gridTemplateRows: "auto",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridTemplateAreas: `
    "leftCommand centerCommand rightCommand"
  `,
  gridColumnGap: vars.sizes.xs,
});

export const commandPlayPause = style({
  gridArea: "centerCommand",
  justifySelf: "center",
  alignSelf: "center",
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

export const aborted = style({
  gridArea: "player",
  alignSelf: "center",
  justifySelf: "center",
});

export const autoPlay = style({
  gridArea: "options",
  alignSelf: "center",
  justifySelf: "end",
  display: "grid",
  gridTemplateRows: "auto",
  gridTemplateColumns: "auto min-content",
  gridTemplateAreas: `
    "label button"
  `,
  gridColumnGap: vars.sizes.xs,

  "@media": {
    ...mediaQueries.forPhoneOnly({
      alignSelf: "start",
    }),
  },
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
});
