import * as IO from "fp-ts/IO";
import { pipe } from "fp-ts/function";

import { createStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { shallow } from "zustand/shallow";
import * as Tracks from "./entities/Tracks";
import { readLocalStorageAutoplay } from "./localStorage";

const initTracks: IO.IO<Tracks.Tracks> = pipe(
  readLocalStorageAutoplay,
  IO.map((autoplayEnabled) => Tracks.create({ autoplayEnabled }))
);

const store = createStore<Tracks.Tracks>(initTracks);

export const read: IO.IO<Tracks.Tracks> = store.getState;
export const write =
  (updater: (state: Tracks.Tracks) => Tracks.Tracks): IO.IO<void> =>
  () =>
    store.setState(updater);

export function usePlayer(): Tracks.Tracks;
export function usePlayer<U>(
  selector: (state: Tracks.Tracks) => U,
  equalityFn?: (a: U, b: U) => boolean
): U;
export function usePlayer(
  selector: (state: Tracks.Tracks) => unknown = (state) => state,
  equalityFn: (a: unknown, b: unknown) => boolean = (a, b) => a === b
) {
  return useStoreWithEqualityFn(store, selector, equalityFn);
}

export { shallow as shallowEqual };
