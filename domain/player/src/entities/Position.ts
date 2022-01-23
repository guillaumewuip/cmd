import * as Union from "@fp51/opaque-union";

type $Position = {
  ratio: number; // [0-1]
};

const PositionAPI = Union.of({
  Position: Union.type<$Position>(),
});

export type Position = Union.Type<typeof PositionAPI>;

export const createStart = () => PositionAPI.of.Position({ ratio: 0 });
export const create = (ratio: number) => PositionAPI.of.Position({ ratio });

export const ratio = PositionAPI.lensFromProp("ratio").get;
