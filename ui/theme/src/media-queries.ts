import { breakpoints } from "@cmd/ui-tokens";

export const forPhoneOnly = (content: object) => ({
  [`(max-width: ${breakpoints.phone})`]: content,
});

export const forDesktopOnly = (content: object) => ({
  [`(min-width: ${breakpoints.phone})`]: content,
});

export const forBigDesktopOnly = (content: object) => ({
  [`(min-width: ${breakpoints.bigDesktop})`]: content,
});
