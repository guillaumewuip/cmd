import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const iframe = style({
  border: 0,
  width: "100%",
});

export const container = style({
  display: "block",
  margin: `${vars.sizes.s} 0 ${vars.sizes.xl}`,
});

export const youtubeWrapper = style({
  display: "block",
  position: "relative",
  paddingBottom: "56.25%", // 16:9
  height: 0,
});

globalStyle(`${youtubeWrapper} > iframe`, {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});
