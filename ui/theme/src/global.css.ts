import { globalStyle } from "@vanilla-extract/css";

globalStyle("html", {
  fontSize: "16px",
  backgroundColor: "#fff",
});

// need to specify backgroundColor too for body to stop propagation
// and make prefers-color-scheme work
globalStyle("body", {
  backgroundColor: "#fff",
});

globalStyle("body", {
  "@media": {
    "screen and (prefers-color-scheme: dark)": {
      filter: "invert(1) hue-rotate(180deg)",
    },
  },
});

globalStyle("img, iframe", {
  "@media": {
    "screen and (prefers-color-scheme: dark)": {
      filter: "invert(1) hue-rotate(-180deg)",
    },
  },
});

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});
