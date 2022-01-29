import AbortedText from "../../components/AbortedText";

import * as styles from "./TrackBar.css";

export default function Aborted() {
  return (
    <div className={styles.abortedBar}>
      <div className={styles.abortedBarMessage}>
        <AbortedText />
      </div>
    </div>
  );
}
