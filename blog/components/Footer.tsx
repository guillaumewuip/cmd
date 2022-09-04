import { Footer as UIFooter } from "@cmd/ui-footer";
import { useTheme } from "next-themes";
import { useReducer, useEffect } from "react";

export function Footer() {
  const [mounted, setMounted] = useReducer(() => true, false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted();
  }, []);

  return <UIFooter theme={mounted && { current: theme, onChange: setTheme }} />;
}
