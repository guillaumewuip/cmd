import * as Source from "./entities/Source";
import * as Track from "./entities/Track";
import * as Tracks from "./entities/Tracks";
import * as Position from "./entities/Position";
import * as EmbedableLink from "./entities/EmbedableLink";

import { usePlayer, shallowEqual } from "./store";
import { playOrPause, play } from "./repositories/playPause";
import {
  register,
  loadYoutube,
  loadBandcamp,
  loadSoundcloud,
} from "./repositories/track";
import { saveAutoplayChoice } from "./repositories/autoplay";
import {
  fetchBandcampInfos,
  fetchSoundcloudInfos,
} from "./repositories/source";

export {
  Track,
  Tracks,
  Source,
  Position,
  EmbedableLink,
  usePlayer,
  shallowEqual,
  playOrPause,
  play,
  register,
  loadYoutube,
  loadBandcamp,
  loadSoundcloud,
  saveAutoplayChoice,
  fetchBandcampInfos,
  fetchSoundcloudInfos,
};
