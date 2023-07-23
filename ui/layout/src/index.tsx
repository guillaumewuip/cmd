import { PropsWithChildren } from "react";
import * as styles from "./styles.css";

export default function Page({ children }: PropsWithChildren) {
  return <div className={styles.page}>{children}</div>;
}

Page.Header = function Header({ children }: PropsWithChildren) {
  return <header className={styles.header}>{children}</header>;
};

Page.Player = function Player({ children }: PropsWithChildren) {
  return <div className={styles.player}>{children}</div>;
};

Page.Illustration = {
  Header: function Illustration({ children }: PropsWithChildren) {
    return <div className={styles.illustrationHeader}>{children}</div>;
  },
  Content: function Illustration({ children }: PropsWithChildren) {
    return <div className={styles.illustration}>{children}</div>;
  },
};

Page.Main = {
  Header: function Main({ children }: PropsWithChildren) {
    return <div className={styles.mainHeader}>{children}</div>;
  },
  Content: function Main({ children }: PropsWithChildren) {
    return <main className={styles.main}>{children}</main>;
  },
};

Page.Nav = function Nav({ children }: PropsWithChildren) {
  return <nav className={styles.nav}>{children}</nav>;
};
