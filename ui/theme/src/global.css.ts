import { globalStyle } from "@vanilla-extract/css";
import { defaultFontSize } from "./values/fonts";

globalStyle("html", {
  fontSize: defaultFontSize,
});

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});
