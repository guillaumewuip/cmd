import { Source } from "@cmd/domain-player";

import * as styles from "./Thumbnail.css";

export default function Thumbnail({ source }: { source: Source.Source }) {
  const { url } = Source.thumbnail(source);

  return (
    <div className={styles.container}>
      <img src={url} className={styles.image} alt="" />
    </div>
  );
}
