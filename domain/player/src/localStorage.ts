import * as LocalStorageFP from "fp-ts-local-storage";
import * as IOEither from "fp-ts/IOEither";
import * as IO from "fp-ts/IO";
import * as Option from "fp-ts/Option";
import * as Either from "fp-ts/Either";
import * as D from "io-ts/Decoder";
import * as C from "io-ts/Codec";
import { pipe } from "fp-ts/function";

const BooleanCodec = C.make(D.boolean, {
  encode: String,
});

const autoplayEnabledItemName = "cmd-player-autoplayEnabled";

export const readLocalStorageAutoplay: IO.IO<boolean> = pipe(
  IOEither.tryCatch(
    LocalStorageFP.getItem(autoplayEnabledItemName),
    Either.toError
  ),
  IO.map(Either.getOrElse((): Option.Option<string> => Option.none)),
  IO.map(
    Option.chain((value) => pipe(value, BooleanCodec.decode, Option.fromEither))
  ),
  IO.map(Option.getOrElse((): boolean => true)) // default true
);

export const writeLocalStorageAutoplay = (
  value: boolean
): IOEither.IOEither<Error, void> =>
  IOEither.tryCatch(
    pipe(value, BooleanCodec.encode, (serializedValue) =>
      LocalStorageFP.setItem(autoplayEnabledItemName, serializedValue)
    ),
    Either.toError
  );
