import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'cross-fetch'

import { parseHTML } from 'linkedom';

import { handleGET } from '../../handleRequest'

async function fetchPage(url: string): Promise<Document> {
  const response = await fetch(url)
  const documentString = await response.text()

  return parseHTML(documentString).window.document
}

function extractTrackId(document: Document) {
  const metaContentElement = document.querySelector('meta[content^="soundcloud://sounds:"]')

  if (!metaContentElement) {
    throw new Error(`Can't find meta tag`)
  }

  const content = metaContentElement.getAttribute('content')

  if (!content) {
    throw new Error(`No content on meta tag`)
  }

  const result = content.match(/sounds:(?<id>\d*)/)

  if (result === null) {
    throw new Error(`Can't find trackId`)
  }

  const { groups: { id } = { id: undefined } } = result

  if (id === undefined) {
    throw new Error(`Can't find trackId`)
  }

  return id
}

function extractThumbnail(document: Document): string {
  const meta = document.querySelector('meta[property="og:image"]')

  if (!meta) {
    throw new Error(`Can't find og:image meta tag`)
  }

  const href = meta.getAttribute('content')

  return href
}

const handleSoundcloud = handleGET(async (req: VercelRequest, res: VercelResponse) => {
  const url = req.query.url

  if (!url || Array.isArray(url)) {
    res.status(400).json({
      error: 'Missing correct url query parameter'
    })
    return
  }

  const page = await fetchPage(decodeURIComponent(url))
  const trackId = extractTrackId(page)
  const thumbnail = extractThumbnail(page)

  res.status(200).json({
    trackId,
    thumbnail,
  })
  return
})

export default handleSoundcloud
