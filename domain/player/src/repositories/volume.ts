import * as IO from "fp-ts/IO";
import { pipe } from "fp-ts/function";

import * as Volume from "../entities/Volume";
import * as Tracks from "../entities/Tracks";
import * as Track from "../entities/Track";

import * as Store from "../store";
import { volume } from "../localStorage";

import * as TrackRepo from "./track";

export function setVolumeForCurrentTrack(): IO.IO<void> {
  return () => {
    const state = Store.read();

    // nothing to do here
    if (Tracks.isEmpty(state)) {
      return IO.of(undefined);
    }

    const selectedTrack = Tracks.selectedTrack(state);

    // nothing to do here
    if (!Track.isInteractive(selectedTrack)) {
      return IO.of(undefined);
    }

    const value = pipe(state, Tracks.volume, Volume.value);

    return TrackRepo.setVolume(value)(selectedTrack);
  };
}

export function updateVolume(newVolume: Volume.Volume): IO.IO<void> {
  return pipe(
    volume.silentWrite(Volume.value(newVolume)),
    IO.chainFirst(() => Store.write(Tracks.setVolume(newVolume))),
    IO.chain(setVolumeForCurrentTrack)
  );
}
