import { style } from "@vanilla-extract/css";
import { vars, mediaQueries } from "@cmd/ui-theme";

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  columnGap: vars.sizes.m,
  rowGap: vars.sizes.m,

  margin: `${vars.sizes.s} 0`,

  "@media": {
    ...mediaQueries.forDesktopOnly({
      gridTemplateColumns: "repeat(4, 1fr)",
    }),
  },
});

export const article = style({
  position: "relative",

  aspectRatio: "1",
  lineHeight: 0,
});

export const nextImage = style({
  width: "100%",
  height: "100%",
});

export const overlay = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: vars.colors.darkOverlay,
  opacity: 0.2,

  selectors: {
    [`${article}:hover &`]: {
      opacity: 0.5,
    },
  },
});

export const title = style({
  position: "absolute",
  textAlign: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});
