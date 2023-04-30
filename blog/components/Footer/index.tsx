import { Footer as UIFooter } from "@cmd/ui-footer";

import { ThemeSelection } from "./ThemeSelection";

export function Footer() {
  return <UIFooter theme={<ThemeSelection />} />;
}
