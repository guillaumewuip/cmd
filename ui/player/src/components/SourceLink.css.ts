import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

const svg = style({
  filter: vars.colors.playerSourceFilter,
  opacity: 0.8,
  position: "relative",

  selectors: {
    "&:hover, &:focus": {
      filter: vars.colors.playerSourceFilterHover,
      opacity: 1,
    },

    "&:active": {
      top: "0.1rem",
      filter: vars.colors.playerSourceFilterHover,
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
