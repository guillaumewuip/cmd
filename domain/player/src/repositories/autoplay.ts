import * as IO from "fp-ts/IO";
import { pipe } from "fp-ts/function";

import * as Tracks from "../entities/Tracks";

import * as Store from "../store";
import { autoplayEnabled } from "../localStorage";

export function saveAutoplayChoice(enabled: boolean): IO.IO<void> {
  return pipe(
    autoplayEnabled.silentWrite(enabled),
    IO.chainFirst(() => Store.write(Tracks.setAutoplay(enabled)))
  );
}
