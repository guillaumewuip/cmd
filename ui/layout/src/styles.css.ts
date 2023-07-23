import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const page = style({
  height: "100vh",
  width: "100vw",

  display: "grid",
  gridTemplateColumns: `10rem min-content auto minmax(15%, 25%)`, // TODO theme
  gridTemplateRows: `10rem auto 10rem`, // TODO theme
  gridTemplateAreas: `
    "header illustrationHeader mainHeader nav"
    "header illustration main nav"
    "header player player player"
  `,

  background: vars.colors.background,
  border: vars.border,
});

export const header = style({
  gridArea: "header",
  borderRight: vars.border,
});

export const player = style({
  gridArea: "player",
  borderTop: vars.border,
});

export const illustrationHeader = style({
  gridArea: "illustrationHeader",
  borderRight: vars.border,
  borderBottom: vars.border,
  display: "grid",
  alignItems: "center",
});

export const illustration = style({
  gridArea: "illustration",
  padding: vars.sizes.l,
  borderRight: vars.border,
});

export const mainHeader = style({
  gridArea: "mainHeader",
  borderRight: vars.border,
  borderBottom: vars.border,
  display: "grid",
  alignItems: "center",
});

export const main = style({
  gridArea: "main",
  overflowY: "scroll",
  padding: vars.sizes.l,
  borderRight: vars.border,
});

export const nav = style({
  gridArea: "nav",
  overflowY: "scroll",
  padding: vars.sizes.l,
});
