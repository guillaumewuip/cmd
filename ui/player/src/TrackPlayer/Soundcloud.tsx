import { useEffect, useRef } from "react";

import { loadSoundcloud } from "@cmd/domain-player";

import { VisuallyAndAriaHidden } from "../components/Hidden";
import TrackBar from "./TrackBar";

export function Player({ id, href }: { id: string; href: string }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current === null) {
      throw new Error("Soundcloud ref is empty");
    }

    loadSoundcloud({
      id,
      soundcloudUrl: href,
      container: ref.current,
    })();
  }, [id, href]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={ref} tabIndex={-1} />
      </VisuallyAndAriaHidden>

      <TrackBar id={id} />
    </>
  );
}
