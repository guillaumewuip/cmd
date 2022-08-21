import { createTheme, createThemeContract } from "@vanilla-extract/css";

import { breakpoints, sizes, colors, fonts } from "@cmd/ui-tokens";

import { MapLeafNodes, CSSVarFunction } from "@vanilla-extract/private";

export type Vars = {
  breakpoints: typeof breakpoints;
  sizes: typeof sizes;
  colors: {
    background: string;

    separator: string;
    dimmedSeparator: string;

    darkOverlay: string;

    accent: string;

    title: string;
    subTitle: string;
    text: string;
    dimmedText: string;
    invertedText: string;

    buttonBackground: string;
    buttonBackgroundInverted: string;

    playerShadow: string;
    playerSourceFilter: string;
    playerSourceFilterHover: string;
  };
  fonts: typeof fonts;
};

const lightColors: Vars["colors"] = {
  background: colors.white,

  separator: colors.dark,
  dimmedSeparator: colors.lightgrey,

  darkOverlay: colors.dark,

  accent: colors.green,

  title: colors.dark,
  subTitle: colors.grey,
  text: colors.dark,
  dimmedText: colors.grey,
  invertedText: colors.white,

  buttonBackground: colors.dark,
  buttonBackgroundInverted: colors.white,

  playerShadow: "rgba(0, 0, 0, 0.16) 0px -1px 4px",
  playerSourceFilter: "grayscale(1)",
  playerSourceFilterHover: "none",
};

const darkColors: Vars["colors"] = {
  background: colors.dark,

  separator: colors.white,
  dimmedSeparator: colors.grey,

  darkOverlay: colors.dark,

  accent: colors.greenAccented,

  title: colors.lightgrey,
  subTitle: colors.grey,
  text: colors.lightgrey,
  dimmedText: colors.grey,
  invertedText: colors.white,

  buttonBackground: colors.white,
  buttonBackgroundInverted: colors.dark,

  playerShadow: "rgba(136, 136, 136, 0.16) 0px -3px 4px",
  playerSourceFilter: "grayscale(1) brightness(5)",
  playerSourceFilterHover: "grayscale(1) brightness(6)",
};

export const vars: MapLeafNodes<Vars, CSSVarFunction> =
  createThemeContract<Vars>({
    breakpoints,
    sizes,
    colors: lightColors,
    fonts,
  });

export const lightThemeClass = createTheme(vars, {
  breakpoints,
  sizes,
  colors: lightColors,
  fonts,
});

export const darkThemeClass = createTheme(vars, {
  breakpoints,
  sizes,
  colors: darkColors,
  fonts,
});
