import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body", {
  padding: 0,
  margin: 0,
  fontSize: "16px",

  "@media": {
    "prefers-color-scheme: dark": {
      filter: "invert(1) hue-rotate(180deg)",
    },
  },
});

globalStyle("img, iframe", {
  "@media": {
    "prefers-color-scheme: dark": {
      filter: "invert(1) hue-rotate(-180deg)",
    },
  },
});

globalStyle("html", {
  backgroundColor: "#fff",
});

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});
