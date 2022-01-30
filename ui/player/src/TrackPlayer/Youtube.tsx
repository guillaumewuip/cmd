import { useRef, useEffect } from "react";

import { loadYoutube } from "@cmd/domain-player";

import { VisuallyAndAriaHidden } from "../components/Hidden";
import TrackBar from "./TrackBar";

export function Player({ id, youtubeId }: { id: string; youtubeId: string }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current === null) {
      throw new Error("Youtube ref is empty");
    }

    loadYoutube({
      id,
      youtubeId,
      container: ref.current,
    })();
  }, [id, youtubeId]);

  return (
    <>
      <VisuallyAndAriaHidden>
        <div ref={ref} tabIndex={-1} />
      </VisuallyAndAriaHidden>

      <TrackBar id={id} />
    </>
  );
}
