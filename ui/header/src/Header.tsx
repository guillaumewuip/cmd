import * as styles from "./Header.css";

export function Header() {
  return (
    <a href="/" className={styles.link}>
      <h1 aria-label="cerfeuil et musique douce">cmd</h1>
    </a>
  );
}
