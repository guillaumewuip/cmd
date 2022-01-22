import { useState, useEffect } from 'react'

import * as TaskEither from 'fp-ts/TaskEither'
import * as Option from 'fp-ts/Option'
import * as Either from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import {
  register,
  usePlayer,
  Tracks,
  Track,
} from '@cmd/domain-player'

import { default as Loading } from './Loading'
import { default as Aborted } from './Aborted'
import { default as Loaded } from './Track'

import { previousTitle } from './previousTitle'
import { position } from './position'

export function Player({
  id,
  loadSource,
}: {
  id: string,
  loadSource: (track: Track.Reserved) => TaskEither.TaskEither<Error, void>
}) {
  const [result, setResult] = useState<Option.Option<Either.Either<Error, unknown>>>(Option.none)

  const maybeTrack = usePlayer(Tracks.findTrackById(id))
  const isSelected = usePlayer(Tracks.isSelected(id))

  useEffect(() => {
    const title = previousTitle(id)
    const weight = position(id)

    if (Option.isNone(title)) {
      throw new Error(`Can't find title for ${id}`)
    }

    const track = register({
      id,
      title: title.value,
      weight,
    })()

    loadSource(track)()
      .then(result => setResult(Option.some(result)))
  }, [id, setResult])

  const state: Option.Option<Either.Either<Error, Track.Track>> = pipe(
    result,
    Option.fold(
      () => Option.none,
      Either.fold(
        error => Option.some(Either.left(error)),
        () => pipe(maybeTrack, Option.map(Either.right))
      )
    )
  )

  return pipe(
    state,
    Option.fold(
      () => <Loading />,
      Either.fold(
        () => <Aborted />,
        track => <Loaded track={track} isSelected={isSelected} />
      )
    )
  )
}

export { default as Loading } from './Loading'
export { default as Aborted } from './Aborted'
