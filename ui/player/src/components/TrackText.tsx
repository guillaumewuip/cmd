import { Paragraph } from "@cmd/ui-text";

import { Track } from "@cmd/domain-player";

export default function TrackText({ track }: { track: Track.Track }) {
  return <Paragraph noMargin>{Track.title(track)}</Paragraph>;
}
