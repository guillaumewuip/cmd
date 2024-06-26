import classnames from "clsx";

import * as styles from "./Text.css";

export function Paragraph({
  children,
  centered = false,
  inverted = false,
  noMargin = false,
}: {
  children: React.ReactNode;
  centered?: boolean;
  inverted?: boolean;
  noMargin?: boolean;
}) {
  return (
    <p
      className={classnames(styles.paragraph, {
        [styles.centered]: centered,
        [styles.inverted]: inverted,
        [styles.noMargin]: noMargin,
      })}
    >
      {children}
    </p>
  );
}

export function Small({ children }: { children: React.ReactNode }) {
  return <p className={styles.small}>{children}</p>;
}

export function Link({ href, children }: { href: string; children: string }) {
  return (
    <a className={styles.a} href={href}>
      {children}
    </a>
  );
}

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className={styles.h1}>{children}</h1>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className={styles.h2}>{children}</h2>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className={styles.h3}>{children}</h3>;
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className={styles.code}>{children}</code>;
}

export function Blockquote({ children }: { children: React.ReactNode }) {
  return <blockquote className={styles.blockquote}>{children}</blockquote>;
}

export function Monospace({ children }: { children: React.ReactNode }) {
  return <span className={styles.monospace}>{children}</span>;
}
