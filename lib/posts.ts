import fs from 'fs'
import path from 'path'

import { format as formatDate } from 'date-fns'

import { pipe } from 'fp-ts/function';
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray'
import * as Task from 'fp-ts/Task';
import * as Ord from 'fp-ts/Ord';
import * as DateFP from 'fp-ts/Date';

import * as Metadata from './postMetadata';
import * as SiteMetadata from '../metadata';

const postsDirectory = path.join(process.cwd(), '_posts')

function dateFromFilename(filename: string): Date {
  const match = filename.match(/(?<date>\d\d\d\d-\d\d-\d\d)/)

  if (match === null) {
    throw new Error(`Can't apply date regex pattern on filename ${filename}`)
  }

  const { groups: { date } = { date: undefined} } = match

  if (!date) {
    throw new Error(`Can't extract date from filename ${filename}`)
  }

  return new Date(`${date}T00:00:00`)
}

function fullNameFromFilename(filename: string): string {
  const match = filename.match(/(?<fullName>\d\d\d\d-\d\d-\d\d-[\w\-\_]*)/)

  if (match === null) {
    throw new Error(`Can't apply fullName regex pattern on filename ${filename}`)
  }

  const { groups: { fullName } = { fullName: undefined} } = match

  if (!fullName) {
    throw new Error(`Can't extract fullName from filename ${filename}`)
  }

  return fullName
}

const filenames = pipe(
  fs.readdirSync(postsDirectory),
  ReadonlyArrayFP.sort(Ord.reverse(Ord.contramap<Date, string>(dateFromFilename)(DateFP.Ord))),
)

export function getAllPostsPaths() {
  return pipe(
    filenames,
    ReadonlyArrayFP.map(filename => ({
      params: {
        fullName: fullNameFromFilename(filename),
      }
    }))
  )
}

export type PostInfos = Readonly<{
  fullName: string
  url: string,
  metadata: Metadata.PostMetadata,
  createdAt: string,
}>

export type Post = Readonly<{
  rawCreatedAt: Date,
  infos: PostInfos,
}>

export async function getPostInfosFromFullname(fullName: string): Promise<Post> {
  const { metadata } = await import(`../_posts/${fullName}.mdx`)

  const date = dateFromFilename(fullName)
  const createdAt = formatDate(date, 'dd/MM/Y')

  const url = `${SiteMetadata.site.url}/post/${fullName}`

  return {
    rawCreatedAt: date,
    infos: {
      fullName,
      url,
      metadata,
      createdAt,
    }
  }
}

export async function getLastPostInfos(): Promise<Post> {
  const filename = filenames[0]
  const fullName = fullNameFromFilename(filename)

  return getPostInfosFromFullname(fullName)
}

export async function getAllPostInfos(): Promise<ReadonlyArray<Post>> {
  return pipe(
    filenames,
    ReadonlyArrayFP.map(fullNameFromFilename),
    ReadonlyArrayFP.map(filename => () => getPostInfosFromFullname(filename)),
    Task.sequenceArray,
  )()
}
