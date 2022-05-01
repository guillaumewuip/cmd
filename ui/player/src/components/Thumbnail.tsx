import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import { Source } from "@cmd/domain-player";

import * as styles from "./Thumbnail.css";

export default function Thumbnail({ source }: { source: Source.Source }) {
  return (
    <div className={styles.container}>
      {pipe(
        source,
        Source.thumbnail,
        Option.fold(
          () => null,
          ({ url }) => <img src={url} className={styles.image} alt="" />
        )
      )}
    </div>
  );
}
