import * as Union from "@fp51/opaque-union";

type $Unknown = null;

type $UnknownWithYear = {
  year: number;
};

type $Album = {
  year: number;
  title: string;
};

type $EP = {
  year: number;
  title: string;
};

type $Single = {
  year: number;
  title: string;
};

type $Compilation = {
  year: number;
  title: string;
};

const OriginAPI = Union.of({
  Unknown: Union.type<$Unknown>(),
  UnknownWithYear: Union.type<$UnknownWithYear>(),
  Album: Union.type<$Album>(),
  EP: Union.type<$EP>(),
  Single: Union.type<$Single>(),
  Compilation: Union.type<$Compilation>(),
});

export type Origin = Union.Type<typeof OriginAPI>;

export const { fold } = OriginAPI;

export const createUnknown = OriginAPI.of.Unknown;
export const createUnknownWithYear = OriginAPI.of.UnknownWithYear;
export const createAlbum = OriginAPI.of.Album;
export const createEP = OriginAPI.of.EP;
export const createSingle = OriginAPI.of.Single;
export const createCompilation = OriginAPI.of.Compilation;
