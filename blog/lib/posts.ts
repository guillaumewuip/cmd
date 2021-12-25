import fs from 'fs'
import path from 'path'
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { format as formatDate } from 'date-fns'
import { JSDOM } from 'jsdom';

import { pipe } from 'fp-ts/function';
import * as ReadonlyArrayFP from 'fp-ts/ReadonlyArray'
import * as Task from 'fp-ts/Task';
import * as Ord from 'fp-ts/Ord';
import * as DateFP from 'fp-ts/Date';

import { Post } from '@cmd/domain';

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

function postExcerpt(content: Parameters<typeof React.createElement>[0]) {
  const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(content))

  const document = new JSDOM(markup).window.document

  const result = document.evaluate('.//h2[1]//preceding::p', document, null, 0)

  const nodes: Node[] = [];
  let node = result.iterateNext();
  while (node) {
    nodes.push(node);
    node = result.iterateNext();
  }

  const excerpt = nodes.map(node => node.textContent).join('\n')

  return excerpt
}

export async function getPostInfosFromFullname(fullName: string): Promise<Post.Post> {
  const post = await import(`../_posts/${fullName}.mdx`)

  const excerpt = postExcerpt(post.default)

  const date = dateFromFilename(fullName)
  const createdAt = formatDate(date, 'dd/MM/y')

  const url = `${SiteMetadata.site.url}/post/${fullName}`

  return {
    infos: {
      fullName,
      url,
      metadata: post.metadata,
      createdAt,
    },
    excerpt
  }
}

export async function getLastPostInfos(): Promise<Post.Post> {
  const filename = filenames[0]
  const fullName = fullNameFromFilename(filename)

  return getPostInfosFromFullname(fullName)
}

export async function getAllPostInfos(): Promise<ReadonlyArray<Post.Post>> {
  return pipe(
    filenames,
    ReadonlyArrayFP.map(fullNameFromFilename),
    ReadonlyArrayFP.map(filename => () => getPostInfosFromFullname(filename)),
    Task.sequenceArray,
  )()
}
