import * as Union from '@fp51/opaque-union'

type $Youtube = {
  player: any
}

type $Soundcloud = {
  widget: any
}

type $Bandcamp = {
  audio: HTMLAudioElement
}

const TrackSourceAPI = Union.of({
  Youtube: Union.type<$Youtube>(),
  Soundcloud: Union.type<$Soundcloud>(),
  Bandcamp: Union.type<$Bandcamp>(),
})

export type TrackSource = Union.Type<typeof TrackSourceAPI>;
export type Youtube = ReturnType<typeof TrackSourceAPI.of.Youtube>;
export type Soundcloud = ReturnType<typeof TrackSourceAPI.of.Soundcloud>;
export type Bandcamp = ReturnType<typeof TrackSourceAPI.of.Bandcamp>;

export const createYoutube = TrackSourceAPI.of.Youtube
export const createSoundcloud = TrackSourceAPI.of.Soundcloud
export const createBandcamp = TrackSourceAPI.of.Bandcamp

export const audio = TrackSourceAPI.Bandcamp.lensFromProp('audio').get
export const player = TrackSourceAPI.Youtube.lensFromProp('player').get
export const widget = TrackSourceAPI.Soundcloud.lensFromProp('widget').get

export const fold = TrackSourceAPI.fold
