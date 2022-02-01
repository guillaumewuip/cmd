import { style } from "@vanilla-extract/css";

const svg = style({
  filter: "grayscale(1)",

  selectors: {
    "&:hover, &:focus": {
      filter: "none",
    },

    "&:active": {
      filter: "none",
    },
  },
});

export const youtube = style([
  svg,
  {
    width: "52px",
  },
]);

export const bandcamp = style([
  svg,
  {
    width: "64px",
  },
]);

export const soundcloud = style([
  svg,
  {
    width: "70px",
  },
]);
