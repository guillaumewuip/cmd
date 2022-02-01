import * as TrackSource from "./entities/TrackSource";
import * as Track from "./entities/Track";
import * as Tracks from "./entities/Tracks";
import * as Position from "./entities/Position";

import { usePlayer, shallowEqual } from "./store";
import { playOrPause, play } from "./repositories/playPause";
import {
  reserve,
  loadYoutube,
  loadBandcamp,
  loadSoundcloud,
} from "./repositories/track";
import { saveAutoplayChoice } from "./repositories/autoplay";

export {
  Track,
  Tracks,
  TrackSource,
  Position,
  usePlayer,
  shallowEqual,
  playOrPause,
  play,
  reserve as register,
  loadYoutube,
  loadBandcamp,
  loadSoundcloud,
  saveAutoplayChoice,
};
