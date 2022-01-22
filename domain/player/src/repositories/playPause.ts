import * as IO from 'fp-ts/IO'
import * as IOEither from 'fp-ts/IOEither'
import { pipe } from 'fp-ts/function'

import * as Track from '../entities/Track'
import * as Tracks from '../entities/Tracks'
import * as Store from '../store'

import * as TrackRepo from './track'

function selectAndPlayTrack(track: Track.Initialized) {
  return (state: Tracks.Loaded): IO.IO<void> => {
    return pipe(
      Store.write(() => pipe(
        state,
        Tracks.selectTrack(track),
        Tracks.playing,
      )),
      IO.chain(() => TrackRepo.play(track)),
    )
  }
}


export const playOrPause = pipe(
  Store.read,
  IO.chain(state => {
    // nothing to do here
    if (Tracks.isEmpty(state)) {
      return IO.of(undefined)
    }

    const selectedTrack = pipe(
      state,
      Tracks.selectedTrack
    )

    // nothing to do here
    if (!Track.isInteractive(selectedTrack)) {
      return IO.of(undefined)
    }

    return Track.isPlaying(selectedTrack)
      ? TrackRepo.pause(selectedTrack)
      : selectAndPlayTrack(selectedTrack)(state)
  })
)

function pauseIfNeeded(state: Tracks.Loaded): IO.IO<void> {
  const selectedTrack = pipe(
    state,
    Tracks.selectedTrack
  )

  if (Track.isInteractive(selectedTrack)) {
    return TrackRepo.pause(selectedTrack)
  }

  return IOEither.of(undefined)
}

export function play(track: Track.Initialized): IO.IO<void> {
  return pipe(
    Store.read,
    IO.chain(state => {
      // nothing to do here
      if (Tracks.isEmpty(state)) {
        return IO.of(undefined)
      }

      // nothing to do here
      return pipe(
        IO.of(state),
        IO.chainFirst(pauseIfNeeded),
        IO.chainFirst(() => TrackRepo.reset(track)),
        IO.chain(selectAndPlayTrack(track)),
      )
    })
  )
}
