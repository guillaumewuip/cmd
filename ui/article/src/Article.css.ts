import { style } from "@vanilla-extract/css";
import { vars } from "@cmd/ui-theme";

export const imageSection = style({
  width: "22rem", // TODO theme
  backgroundColor: vars.colors.background,
});

export const imageContainer = style({
  position: "relative",
  width: "100%",
  marginBottom: vars.sizes.xs,
});

export const nextImage = style({
  width: "100%",
  objectFit: "contain",
  objectPosition: "top",
  height: "auto",
});

export const caption = style({
  textAlign: "center",
  marginBottom: vars.sizes.s,
});

export const metadata = style({
  marginTop: vars.sizes.s,
});

export const text = style({});
