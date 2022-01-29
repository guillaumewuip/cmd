import * as styles from "./Hidden.css";

// eslint-disable-next-line @typescript-eslint/ban-types
export function VisuallyHidden({ children }: React.PropsWithChildren<{}>) {
  return <div className={styles.hidden}>{children}</div>;
}

export function VisuallyAndAriaHidden({
  children,
}: // eslint-disable-next-line @typescript-eslint/ban-types
React.PropsWithChildren<{}>) {
  return (
    <div className={styles.hidden} aria-hidden tabIndex={-1}>
      {children}
    </div>
  );
}
