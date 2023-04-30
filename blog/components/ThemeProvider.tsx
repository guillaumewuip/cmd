"use client";

import { lightThemeClass, darkThemeClass } from "@cmd/ui-theme";

import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      value={{
        light: lightThemeClass,
        dark: darkThemeClass,
      }}
    >
      {children}
    </NextThemeProvider>
  );
}
