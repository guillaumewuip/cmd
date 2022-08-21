import { phone, bigDesktop } from "./values/breakpoints";

export const forPhoneOnly = (content: object) => ({
  [`(max-width: ${phone})`]: content,
});

export const forDesktopOnly = (content: object) => ({
  [`(min-width: ${phone})`]: content,
});

export const forBigDesktopOnly = (content: object) => ({
  [`(min-width: ${bigDesktop})`]: content,
});
