import { PropsWithChildren } from "react";
import * as styles from "./Page.css";

export function Page({ children }: PropsWithChildren) {
  return <div className={styles.page}>{children}</div>;
}
