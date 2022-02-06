import * as Union from "@fp51/opaque-union";

import * as Genre from "./Genre";
import * as Origin from "./Origin";

type $Track = {
  artists: string[];
  title: string;
  genres: Genre.Genre[];
  origin: Origin.Origin;
  sourceUrl: string;
};

const TrackApi = Union.of({
  Track: Union.type<$Track>(),
});

export type Track = Union.Type<typeof TrackApi>;

export function create(data: $Track): Track {
  return TrackApi.of.Track(data);
}

export const artists = TrackApi.lensFromProp("artists").get;
export const title = TrackApi.lensFromProp("title").get;
export const genres = TrackApi.lensFromProp("genres").get;
export const origin = TrackApi.lensFromProp("origin").get;
export const source = TrackApi.lensFromProp("sourceUrl").get;
