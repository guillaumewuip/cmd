import * as Union from '@fp51/opaque-union'
import * as Option from 'fp-ts/Option'
import * as Eq from 'fp-ts/Eq'
import * as StringFP from 'fp-ts/string'
import { pipe } from 'fp-ts/function'

import * as Source from './TrackSource'
import * as Position from './Position'

type $Reserved = {
  id: string,
  title: string,
}

type $Initialized = $Reserved & {
  duration: Option.Option<number>, // in seconds
  source: Source.TrackSource,
}

type $Aborted = $Initialized

type $Loading = $Initialized & {
  position: Option.Option<Position.Position>
}

type $Playing = $Initialized & {
  position: Position.Position
}

type $Paused = $Initialized & {
  position: Position.Position
}

const TrackAPI = Union.of({
  Reserved: Union.type<$Reserved>(),
  Aborted: Union.type<$Aborted>(),
  Loading: Union.type<$Loading>(),
  Playing: Union.type<$Playing>(),
  Paused: Union.type<$Paused>(),
});

export type Track = Union.Type<typeof TrackAPI>
export type Reserved = ReturnType<typeof TrackAPI.of.Reserved>
export type Aborted = ReturnType<typeof TrackAPI.of.Aborted>
export type Loading = ReturnType<typeof TrackAPI.of.Loading>
export type Playing = ReturnType<typeof TrackAPI.of.Playing>
export type Paused = ReturnType<typeof TrackAPI.of.Paused>

export const isReserved = TrackAPI.is.Reserved
export const isPlaying = TrackAPI.is.Playing
export const isPaused = TrackAPI.is.Paused
export const isAborted = TrackAPI.is.Aborted
export const isLoading = TrackAPI.is.Loading

export const fold = TrackAPI.fold

export const id = TrackAPI.lensFromProp('id').get
export const title = TrackAPI.lensFromProp('title').get
export const maybePosition = TrackAPI.Loading.lensFromProp('position').get

export const eqId: Eq.Eq<Track> = Eq.contramap(id)(StringFP.Eq)

const InitializedTrackAPI = Union.omit(TrackAPI, ['Reserved'])
export type Initialized = Union.Type<typeof InitializedTrackAPI>

export const isInitialized = InitializedTrackAPI.is
export const source = InitializedTrackAPI.lensFromProp('source').get
export const duration = InitializedTrackAPI.lensFromProp('duration').get
export const updateDuration = (duration: number) => InitializedTrackAPI.lensFromProp('duration').set(Option.some(duration))

const InteractiveTrackAPI = Union.pick(TrackAPI, ['Playing', 'Paused'])
export type PlayingOrPaused = Union.Type<typeof InteractiveTrackAPI>

export const isInteractive = InteractiveTrackAPI.is
export const position = InteractiveTrackAPI.lensFromProp('position').get

export const reserved = ({ id, title } : {
  id: string,
  title: string,
}) => TrackAPI.of.Reserved({
  id,
  title,
})

export const initialized = ({ source } : {
  source: Source.TrackSource
}) => (track: Reserved) => TrackAPI.of.Loading({
  id: id(track),
  title: title(track),
  source,
  duration: Option.none,
  position: Option.none
})

export const started = (track: Loading) => TrackAPI.of.Playing({
  id: id(track),
  title: title(track),
  source: source(track),
  duration: duration(track),
  position: Position.createStart()
})

export const loaded = (track: Loading) => TrackAPI.of.Paused({
  id: id(track),
  title: title(track),
  source: source(track),
  duration: duration(track),
  position: Position.createStart()
})

export const paused = (track: Playing) => TrackAPI.of.Paused({
  id: id(track),
  title: title(track),
  source: source(track),
  duration: duration(track),
  position: position(track)
})

export const resumed = (track: Paused) => TrackAPI.of.Playing({
  id: id(track),
  title: title(track),
  source: source(track),
  duration: duration(track),
  position: position(track)
})

export const buffering = (track: PlayingOrPaused) => TrackAPI.of.Loading({
  id: id(track),
  title: title(track),
  source: source(track),
  duration: duration(track),
  position: pipe(track, position, Option.some),
})

export const buffered = (track: Loading) => TrackAPI.of.Playing({
  id: id(track),
  title: title(track),
  source: source(track),
  duration: duration(track),
  position: pipe(
    track,
    TrackAPI.Loading.lensFromProp('position').get,
    Option.getOrElse(Position.createStart),
  ),
})

export const aborted = (track: Initialized) => TrackAPI.of.Aborted({
  id: id(track),
  title: title(track),
  source: source(track),
  duration: duration(track),
})

export const positionChanged = InteractiveTrackAPI.lensFromProp('position').set

