import { style } from "@vanilla-extract/css";

const svg = style({
  filter: "grayscale(1)",
  opacity: 0.8,
  position: "relative",

  selectors: {
    "&:hover, &:focus": {
      filter: "none",
      opacity: 1,
    },

    "&:active": {
      top: "0.1rem",
      filter: "none",
      opacity: 1,
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
