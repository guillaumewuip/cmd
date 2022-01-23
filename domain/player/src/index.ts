import * as Track from "./entities/Track";
import * as Tracks from "./entities/Tracks";
import * as Position from "./entities/Position";

import { usePlayer } from "./store";
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
  Position,
  usePlayer,
  playOrPause,
  play,
  reserve as register,
  loadYoutube,
  loadBandcamp,
  loadSoundcloud,
  saveAutoplayChoice,
};
