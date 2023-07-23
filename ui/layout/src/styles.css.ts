import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const page = style({
  display: "grid",
  gridTemplateColumns: `fit-content(50%) auto`,
  gridTemplateRows: `auto fit-content(50%) `,
  gridTemplateAreas: `
    "header content"
    "header player"
  `,
  background: vars.colors.background,
  height: "100vh",
  overflow: "hidden",
});

export const header = style({
  gridArea: "header",
  alignSelf: "stretch",
  borderRight: vars.border,
});

export const headerContent = style({
  transform: "rotate(-180deg)",
  writingMode: "vertical-rl",
  height: "100%",
});

export const player = style({
  gridArea: "player",
  borderTop: vars.border,
});

export const content = style({
  gridArea: "content",

  display: "grid",
  gridTemplateColumns: `auto 25%`,
  gridTemplateRows: `auto fit-content(80%)`,
  gridTemplateAreas: `
    "main nav"
    "footer footer"
  `,
  overflowY: "scroll",
});

export const main = style({
  gridArea: "main",
});

export const nav = style({
  gridArea: "nav",
});

export const footer = style({
  gridArea: "footer",
  marginTop: vars.sizes.m,
  marginBottom: "6rem",
  textAlign: "center",
});
