import * as IO from "fp-ts/IO";
import { pipe } from "fp-ts/function";

import createHook from "zustand";
import createStore from "zustand/vanilla";

import * as Tracks from "./entities/Tracks";
import { autoplayEnabled } from "./localStorage";

const initTracks: IO.IO<Tracks.Tracks> = pipe(
  autoplayEnabled.readOrElse(() => true),
  IO.map((enabled) => Tracks.create({ autoplayEnabled: enabled }))
);

const store = createStore<Tracks.Tracks>(initTracks);

export const read: IO.IO<Tracks.Tracks> = store.getState;
export const write =
  (updater: (state: Tracks.Tracks) => Tracks.Tracks): IO.IO<void> =>
  () =>
    store.setState(updater);

export const usePlayer = createHook(store);

export { default as shallowEqual } from "zustand/shallow";
