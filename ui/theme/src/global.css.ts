import { globalStyle } from "@vanilla-extract/css";
import { fonts } from "@cmd/ui-tokens";

globalStyle("html", {
  fontSize: fonts.defaultFontSize,
});

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});
