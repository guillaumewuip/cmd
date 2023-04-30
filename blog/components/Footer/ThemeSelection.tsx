"use client";

import { ThemeSelection as UIThemeSelection } from "@cmd/ui-footer";
import { useTheme } from "next-themes";
import { useReducer, useEffect } from "react";

export function ThemeSelection() {
  const [mounted, setMounted] = useReducer(() => true, false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted();
  }, []);

  if (!mounted) return null;

  return <UIThemeSelection current={theme} onChange={setTheme} />;
}
