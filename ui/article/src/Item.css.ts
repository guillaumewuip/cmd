import { style } from "@vanilla-extract/css";
import { vars, mediaQueries } from "@cmd/ui-theme";

export const grid = style({
  display: "grid",
  gridColumnGap: vars.sizes.m,
  gridRowGap: vars.sizes.s,
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr",
  gridTemplateAreas: `
        "content"
        "action"
      `,
  alignItems: "center",

  marginTop: `${vars.sizes.l}`,

  "@media": {
    ...mediaQueries.forDesktopOnly({
      gridTemplateColumns: "2fr 4fr 1fr",
      gridTemplateRows: "1fr",
      gridTemplateAreas: `
    "image content action"
  `,
    }),
  },
});

export const image = style({
  gridArea: "image",
  display: "none",

  "@media": {
    ...mediaQueries.forDesktopOnly({
      display: "block",
    }),
  },
});
export const nextImage = style({
  width: "100%",
  objectFit: "contain",
  objectPosition: "top",
  height: "auto",
});

export const content = style({
  gridArea: "content",
});

export const action = style({
  gridArea: "action",
});

export const button = style({
  border: `1px solid ${vars.colors.buttonBackground}`,
  outline: "inherit",
  borderRadius: "20px",
  textDecoration: "none",
  padding: `${vars.sizes.s}`,
  whiteSpace: "nowrap",

  selectors: {
    "&:visited": {
      color: vars.colors.text,
    },

    "&:hover, &:focus": {
      cursor: "pointer",
      backgroundColor: vars.colors.buttonBackground,
      color: vars.colors.background,
    },

    "&:active": {
      borderColor: vars.colors.background,
    },
  },
});
