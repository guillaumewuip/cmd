import * as Union from "@fp51/opaque-union";

type $Volume = {
  value: number; // [0-1]
};

const VolumeAPI = Union.of({
  Volume: Union.type<$Volume>(),
});

export type Volume = Union.Type<typeof VolumeAPI>;

export const create = (value: number) => VolumeAPI.of.Volume({ value });

export const value = VolumeAPI.lensFromProp("value").get;
