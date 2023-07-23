import { PropsWithChildren } from "react";
import * as styles from "./styles.css";

export default function Page({ children }: PropsWithChildren) {
  return <div className={styles.page}>{children}</div>;
}

Page.Header = function Header({ children }: PropsWithChildren) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>{children}</div>
    </header>
  );
};

Page.Player = function Player({ children }: PropsWithChildren) {
  return <div className={styles.player}>{children}</div>;
};

// export needed here for TS
export function Content({ children }: PropsWithChildren) {
  return <div className={styles.content}>{children}</div>;
}

Content.Main = function Main({ children }: PropsWithChildren) {
  return <main className={styles.main}>{children}</main>;
};

Content.Nav = function Nav({ children }: PropsWithChildren) {
  return <nav className={styles.nav}>{children}</nav>;
};

Content.Footer = function Footer({ children }: PropsWithChildren) {
  return <footer className={styles.footer}>{children}</footer>;
};

Page.Content = Content;
