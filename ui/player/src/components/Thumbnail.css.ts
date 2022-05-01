import { style } from "@vanilla-extract/css";

export const container = style({
  display: "block",
  position: "relative",

  width: "100%",

  selectors: {
    "&::after": {
      content: "",
      display: "block",
      paddingBottom: "100%",
    },
  },
});

export const image = style({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
});
