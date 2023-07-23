import { Link, Small } from "@cmd/ui-text";

import React from "react";
import * as styles from "./Footer.css";

type Theme = "system" | "light" | "dark";

const parseTheme = (maybeTheme: string): Theme => {
  switch (maybeTheme) {
    case "system":
    case "light":
    case "dark": {
      return maybeTheme;
    }

    default:
      return "system";
  }
};

export function ThemeSelection({
  current,
  onChange,
}: {
  current: Theme | string | undefined;
  onChange: (newTheme: Theme) => void;
}) {
  return (
    <label htmlFor="theme">
      Theme:
      <select
        className={styles.select}
        name="theme"
        id="theme"
        value={current}
        onChange={(event) => {
          const newTheme = parseTheme(event.target.value);

          onChange(newTheme);
        }}
      >
        <option value="system">sytème</option>
        <option value="light">clair</option>
        <option value="dark">sombre</option>
      </select>
    </label>
  );
}

export function Footer({ theme }: { theme?: React.ReactNode }) {
  return (
    <footer className={styles.footer}>
      <Small>
        <Link href="/">cerfeuil et musique douce</Link> -{" "}
        <Link href="/rss/feed.xml">RSS</Link> -{" "}
        <Link href="https://guillaume.wuips.com">Contact</Link> -{" "}
        <Link href="https://github.com/guillaumewuip/cmd">Github</Link> -{" "}
        {theme && theme}
      </Small>
    </footer>
  );
}
