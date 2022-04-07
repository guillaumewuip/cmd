import * as IO from "fp-ts/IO";
import * as IOEither from "fp-ts/IOEither";
import { pipe } from "fp-ts/function";

import * as Store from "../store";
import { writeLocalStorageAutoplay } from "../localStorage";

export function saveAutoplayChoice(autoplayEnabled: boolean): IO.IO<void> {
  return pipe(
    writeLocalStorageAutoplay(autoplayEnabled),
    IOEither.chainFirstIOK(() =>
      Store.write((tracks) => ({ ...tracks, autoplayEnabled }))
    ),
    IOEither.getOrElse((): IO.IO<void> => IO.of(undefined)) // silence error
  );
}
