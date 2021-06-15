import fs from 'fs'
import path from 'path'

import { format as formatDate } from 'date-fns'

import { pipe } from 'fp-ts/function';
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray'
import * as Option from 'fp-ts/Option';
import * as Task from 'fp-ts/Task';
import * as Ord from 'fp-ts/Ord';
import * as DateFP from 'fp-ts/Date';

import * as Filename from './postFilename'
import * as Metadata from './postMetadata';

const postsDirectory = path.join(process.cwd(), '_posts')
const filenames = pipe(
  fs.readdirSync(postsDirectory),
  ReadonlyArrayFP.sort(Ord.reverse(Ord.contramap<Date, string>(Filename.dateFromFilename)(DateFP.Ord))),
)

const pageSize = 10;

const pages = pipe(
  filenames,
  ReadonlyArrayFP.chunksOf(pageSize),
)

const numberOfPages = ReadonlyArrayFP.size(pages)

export function getPostFilenames(): ReadonlyArray<string> {
  return filenames
}

export function getPostFilenamesGroupedByPage(): ReadonlyArray<ReadonlyArray<string>> {
  return pages
}

export function getPostFilenamesForPage(page: number): Option.Option<ReadonlyArray<string>> {
  return pipe(pages, ReadonlyArrayFP.lookup(page))
}

export function previousPage(page: number) {
  return page === 1 ? Option.none : Option.some(`${page - 1}`);
}

export function nextPage(page: number) {
  return (page === numberOfPages) ? Option.none : Option.some(`${page + 1}`);
}

export type PostInfos = Readonly<{
  fullName: string
  metadata: Metadata.PostMetadata,
  createdAt: string,
}>

export async function getPostInfosFromFullname(fullName: string): Promise<PostInfos> {
  const { metadata } = await import(`../_posts/${fullName}.mdx`)

  const date = Filename.dateFromFilename(fullName)
  const createdAt = formatDate(date, 'dd/MM/Y')

  return {
    fullName,
    metadata,
    createdAt,
  }
}

export async function getLastPostInfos(): Promise<PostInfos> {
  const filename = filenames[0]
  const fullName = Filename.fullNameFromFilename(filename)

  return getPostInfosFromFullname(fullName)
}

export async function getPreviousPostInfos(): Promise<ReadonlyArray<PostInfos>> {
  return pipe(
    filenames,
    ReadonlyArrayFP.map(Filename.fullNameFromFilename),
    ReadonlyArrayFP.map(filename => () => getPostInfosFromFullname(filename)),
    Task.sequenceArray,
  )()
}


export async function getPostInfosForPage(index: number): Promise<Option.Option<ReadonlyArray<PostInfos>>> {
  const page = pipe(
    pages,
    ReadonlyArrayFP.lookup(index)
  );

  if (Option.isNone(page)) {
    return Option.none
  }

  const metadataForPosts = pipe(
    page.value,
    ReadonlyArrayFP.map(filename => () => getPostInfosFromFullname(Filename.fullNameFromFilename(filename))),
    Task.sequenceArray,
    Task.map(Option.some)
  )

  return metadataForPosts()
}

