import { useState, useEffect, useRef } from "react";
import classnames from "classnames";

import { VisuallyHidden } from "./Hidden";

import * as styles from "./Button.css";

// type Size = "large" | "medium" | "small";

export function Play({
  trackName,
  onClick,
}: {
  trackName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={classnames(styles.commandButton, styles.large)}
      onClick={onClick}
    >
      <VisuallyHidden>Lancer la lecture de {trackName}</VisuallyHidden>
      <svg
        className={styles.svg}
        viewBox="0 0 526 526"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M468 263 116 466V60l352 203Z" />
      </svg>
    </button>
  );
}

export function Pause({
  trackName,
  onClick,
}: {
  trackName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={classnames(styles.commandButton, styles.large)}
      onClick={onClick}
    >
      <VisuallyHidden>Suspendre la lecture de {trackName}</VisuallyHidden>
      <svg
        className={styles.svg}
        viewBox="0 0 526 526"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M118 56h113v413H118zM296 56h112v413H296z" />
      </svg>
    </button>
  );
}

function NextPrevIcon({ arrow }: { arrow: "next" | "prev" }) {
  return (
    <svg
      className={arrow === "prev" ? styles.svgPrev : styles.svgNext}
      viewBox="0 0 526 526"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M425 266 73 469V63l352 203Z" />
      <path d="M342 56h112v413H342z" />
    </svg>
  );
}

export function Next({
  trackName,
  onClick,
}: {
  trackName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={classnames(styles.commandButton, styles.medium)}
      onClick={onClick}
    >
      <VisuallyHidden>Lancer la lecture de {trackName}</VisuallyHidden>
      <NextPrevIcon arrow="next" />
    </button>
  );
}

export function Prev({
  trackName,
  onClick,
}: {
  trackName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={classnames(styles.commandButton, styles.medium)}
      onClick={onClick}
    >
      <VisuallyHidden>Lancer la lecture de {trackName}</VisuallyHidden>
      <NextPrevIcon arrow="prev" />
    </button>
  );
}

function AutoPlayOnIcon() {
  return (
    <svg
      className={styles.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 526 526"
    >
      <g clipPath="url(#a)">
        <path d="m374.75 263.25-176 101.5v-203l176 101.5Z" />
        <path d="M263.25 55.75a207.499 207.499 0 0 1 88.884 394.999 207.498 207.498 0 0 1-252.296-59.621 207.498 207.498 0 0 1 2.779-259.23l30.373 24.837a168.266 168.266 0 1 0 130.26-61.75V55.75Z" />
        <path d="M134.5 115 31 143l7.5 28 75.5-20 20 76 28.5-7.5-28-104.5Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h526v526H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function AutoPlayOffIcon() {
  return (
    <svg
      className={styles.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 526 526"
    >
      <g clipPath="url(#a)">
        <path d="M190 159h57v208h-57zM280 159h56v208h-56z" />
        <path d="M263.25 55.75a207.499 207.499 0 0 1 88.884 394.999 207.498 207.498 0 0 1-252.296-59.621 207.498 207.498 0 0 1 2.779-259.23l30.373 24.837a168.266 168.266 0 1 0 130.26-61.75V55.75Z" />
        <path d="M134.5 115 31 143l7.5 28 75.5-20 20 76 28.5-7.5-28-104.5Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h526v526H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AutoPlay({
  status,
  onClick,
}: {
  status: "on" | "off";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={status === "on"}
      className={classnames(styles.commandButton, styles.medium)}
      onClick={onClick}
    >
      <VisuallyHidden>
        {status === "on"
          ? "Désactiver la lecture automatique"
          : "Activer la lecture automatique"}
      </VisuallyHidden>
      {status === "on" ? <AutoPlayOnIcon /> : <AutoPlayOffIcon />}
    </button>
  );
}

function useRotate() {
  const [quarter, setQuarter] = useState(0);

  const isUnMountedRef = useRef<boolean>(false);

  useEffect(() => {
    const animate = () => {
      if (isUnMountedRef.current) {
        return;
      }

      setQuarter((localQuarter) => (localQuarter + 1) % 4);

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 500);
    };
    animate();

    return () => {
      isUnMountedRef.current = true;
    };
  }, []);

  return quarter * 90;
}

export function Loading() {
  const deg = useRotate();

  return (
    <svg
      className={classnames(styles.svgLoading, styles.large)}
      viewBox="0 0 526 526"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m117 113 299 299H117V113Z"
        style={{
          transform: `rotate(${deg}deg)`,
          transformOrigin: "center center",
        }}
      />
    </svg>
  );
}
