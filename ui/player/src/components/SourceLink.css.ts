import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

const svg = style({
  filter: "grayscale(1)",
  opacity: 0.8,
  padding: `${vars.sizes.s} 0`,

  selectors: {
    "&:hover, &:focus": {
      filter: "none",
      opacity: 1,
    },

    "&:active": {
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
