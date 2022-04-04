import * as TrackSource from "./entities/TrackSource";
import * as Track from "./entities/Track";
import * as Tracks from "./entities/Tracks";
import * as Position from "./entities/Position";
import * as Volume from "./entities/Volume";

import { usePlayer, shallowEqual } from "./store";
import { playOrPause, play } from "./repositories/playPause";
import {
  reserve,
  loadYoutube,
  loadBandcamp,
  loadSoundcloud,
} from "./repositories/track";
import { saveAutoplayChoice } from "./repositories/autoplay";
import { updateVolume } from "./repositories/volume";

export {
  Track,
  Tracks,
  TrackSource,
  Position,
  Volume,
  usePlayer,
  shallowEqual,
  playOrPause,
  play,
  reserve as register,
  loadYoutube,
  loadBandcamp,
  loadSoundcloud,
  saveAutoplayChoice,
  updateVolume,
};
