import { useEffect } from "react";

import { loadBandcamp } from "@cmd/domain-player";

import TrackBar from "./TrackBar";

export function Player({ id, href }: { id: string; href: string }) {
  useEffect(() => {
    loadBandcamp({
      id,
      bandcampUrl: href,
    })();
  }, [id, href]);

  return <TrackBar id={id} />;
}
