import { useEffect, useState } from "react";
import Typewriter, { TypewriterClass } from "typewriter-effect";

import * as styles from "./MainTitle.css";

export function MainTitle() {
  const [showAnim, setShowAnim] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAnim(true);
    }, 6000);

    return () => {
      clearTimeout(timeout);
    };
  }, [setShowAnim]);

  return (
    <h1 className={styles.mainTitle} aria-label="cerfeuil et musique douce">
      {showAnim ? (
        <Typewriter
          options={{
            loop: true,
          }}
          onInit={(typewriter: TypewriterClass) => {
            typewriter
              .typeString("cerfeuil et musique douce")
              .pauseFor(5000)
              .deleteAll()
              .typeString("cmd")
              .pauseFor(20000)
              .start();
          }}
        />
      ) : (
        "cerfeuil et musique douce"
      )}
    </h1>
  );
}
