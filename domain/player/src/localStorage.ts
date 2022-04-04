import * as LocalStorageFP from "fp-ts-local-storage";
import * as IOEither from "fp-ts/IOEither";
import * as IO from "fp-ts/IO";
import * as Option from "fp-ts/Option";
import * as Either from "fp-ts/Either";
import * as D from "io-ts/Decoder";
import * as C from "io-ts/Codec";
import { pipe } from "fp-ts/function";

type LocalStorageIO<T> = {
  readOrElse: (defaultValue: () => T) => IO.IO<T>;
  silentWrite: (value: T) => IO.IO<void>;
};

function buildLocalStorageIO<T>(
  key: string,
  codec: C.Codec<unknown, string, T>
): LocalStorageIO<T> {
  const readOrElse = (defaultValue: () => T) =>
    pipe(
      IOEither.tryCatch(LocalStorageFP.getItem(key), Either.toError),
      IOEither.map((value) =>
        pipe(
          value,
          Option.map(codec.decode),
          Option.map(Either.getOrElse(defaultValue)),
          Option.getOrElse(defaultValue)
        )
      ),
      IO.map(Either.getOrElse(defaultValue))
    );

  const silentWrite = (value: T): IOEither.IOEither<Error, void> =>
    IOEither.tryCatch(
      pipe(value, codec.encode, (serializedValue) =>
        LocalStorageFP.setItem(key, serializedValue)
      ),
      Either.toError
    );

  return {
    readOrElse,
    silentWrite,
  };
}

const BooleanCodec = C.make(D.boolean, {
  encode: String,
});

export const autoplayEnabled = buildLocalStorageIO(
  "cmd-player-autoplayEnabled",
  BooleanCodec
);

const NumberCodec = C.make(D.number, {
  encode: String,
});

export const volume = buildLocalStorageIO("cmd-player-volume", NumberCodec);
