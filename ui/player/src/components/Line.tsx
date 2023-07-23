import { useState, useEffect, useRef } from "react";

import * as styles from "./Line.css";

function useTick() {
  const [tick, setTick] = useState(0);

  const isUnMountedRef = useRef<boolean>(false);

  useEffect(() => {
    const animate = () => {
      if (isUnMountedRef.current) {
        return;
      }

      setTick((localTick) => (localTick + 4) % 100);

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 50);
    };

    animate();

    return () => {
      isUnMountedRef.current = true;
    };
  }, []);

  return tick;
}

export function Line({
  ratio = 0,
  loading = false,
}: {
  ratio?: number;
  loading?: boolean;
}) {
  const tick = useTick();

  // just to show a little marker even if track not started
  const realRatio = loading ? ratio : Math.max(0.005, ratio);

  return (
    <svg
      className={styles.svg}
      width="100%"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={styles.backgroundLine} d="M0 3.5h100" />
      {realRatio && (
        <path
          className={styles.activeLine}
          strokeDasharray={`${realRatio * 100} ${(1 - realRatio) * 100}`}
          d="M0 3.5h100"
        />
      )}
      {loading && (
        <path
          className={styles.activeLine}
          strokeDashoffset={-(realRatio * (100 - tick) + tick)}
          strokeDasharray="4 96"
          d="M0 3.5h100"
        />
      )}
    </svg>
  );
}
