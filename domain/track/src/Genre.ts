import * as D from "io-ts/Decoder";
import * as C from "io-ts/Codec";

import * as Either from "fp-ts/Either";
import * as Union from "@fp51/opaque-union";
import { pipe } from "fp-ts/function";

const Decoder = D.union(
  D.literal("Pop"),
  D.literal("Rock"),
  D.literal("Ambient")
);

const Codec = C.fromDecoder(Decoder);

type $Unknown = null;
type $Known = string;

const GenreAPI = Union.of({
  Unknown: Union.type<$Unknown>(),
  Known: Union.type<$Known>(),
});

export type Genre = Union.Type<typeof GenreAPI>;
export type Known = ReturnType<typeof GenreAPI.of.Known>;
export type Unknown = ReturnType<typeof GenreAPI.of.Unknown>;

export const isUnknown = GenreAPI.is.Unknown;

export function create(text: string): Genre {
  return pipe(
    text,
    Codec.decode,
    Either.fold(
      (): Genre => GenreAPI.of.Unknown(null),
      (genre): Genre => GenreAPI.of.Known(genre)
    )
  );
}

export const toString = GenreAPI.Known.iso.to;
