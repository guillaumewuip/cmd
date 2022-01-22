import * as LocalStorageFP from 'fp-ts-local-storage'
import * as IOEither from 'fp-ts/IOEither'
import * as IO from 'fp-ts/IO'
import * as Option from 'fp-ts/Option'
import * as Either from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

const autoplayEnabledItemName = 'cmd-player-autoplayEnabled'

function parseValue(value: string): Option.Option<boolean> {
  switch (value) {
    case 'true':
      return Option.some(true)

    case 'false':
      return Option.some(false)
  }

  return Option.none
}

function serializeValue(value: boolean): string {
  if (value) {
    return 'true'
  }

  return 'false'
}

export const readLocalStorageAutoplay: IO.IO<boolean> = pipe(
  IOEither.tryCatch(
    LocalStorageFP.getItem(autoplayEnabledItemName),
    Either.toError
  ),
  IO.map(Either.getOrElse((): Option.Option<string> => Option.none)),
  IO.map(Option.chain(parseValue)),
  IO.map(Option.getOrElse((): boolean => true)), // default true
);

export const writeLocalStorageAutoplay = (value: boolean): IOEither.IOEither<Error, void> => pipe(
  IOEither.tryCatch(
    LocalStorageFP.setItem(autoplayEnabledItemName, serializeValue(value)),
    Either.toError
  ),
);

