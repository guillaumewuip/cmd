import { Link, Small } from "@cmd/ui-text";

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

export function Footer({
  theme,
}: {
  theme:
    | {
        current: Theme | string | undefined;
        onChange: (newTheme: Theme) => void;
      }
    | false;
}) {
  return (
    <footer className={styles.footer}>
      <Small>
        <Link href="/">cerfeuil et musique douce</Link> -{" "}
        <Link href="/rss/feed.xml">RSS</Link> -{" "}
        <Link href="https://guillaume.wuips.com">Contact</Link> -{" "}
        <Link href="https://github.com/guillaumewuip/cmd">Github</Link> -{" "}
        {theme && (
          <label htmlFor="theme">
            Theme:
            <select
              className={styles.select}
              name="theme"
              id="theme"
              value={theme.current}
              onChange={(event) => {
                const newTheme = parseTheme(event.target.value);

                theme.onChange(newTheme);
              }}
            >
              <option value="system">sytème</option>
              <option value="light">clair</option>
              <option value="dark">sombre</option>
            </select>
          </label>
        )}
      </Small>
    </footer>
  );
}
