import Skeleton from "react-loading-skeleton";

import * as styles from "./TrackBar.css";

export default function Loading() {
  return <Skeleton height={styles.barHeight} />;
}
