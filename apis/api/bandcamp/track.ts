import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'cross-fetch'

import { parseHTML } from 'linkedom';

import { handleGET } from '../../handleRequest'

async function fetchPage(url: string): Promise<Document> {
  const response = await fetch(url)
  const documentString = await response.text()

  return parseHTML(documentString).window.document
}

function extractTrackId(document: Document): string {
  const metaPagePropertiesElement = document.querySelector('meta[name="bc-page-properties"]')

  if (!metaPagePropertiesElement) {
    throw new Error(`Can't find bc-page-properties meta tag`)
  }

  const content = metaPagePropertiesElement.getAttribute('content')

  if (!content) {
    throw new Error(`No content on bc-page-properties meta tag`)
  }

  const pageProperties = JSON.parse(content)

  if (!('item_id' in pageProperties)) {
    throw new Error(`Can't find item_id in page properties`)
  }

  return pageProperties.item_id
}

function extractStream(document: Document): string {
  const script = document.querySelector('script[data-tralbum]')

  if (!script) {
    throw new Error(`Can't find data-tralbum script tag`)
  }

  const data = JSON.parse(script.getAttribute('data-tralbum') || '')

  const url = Object.values(data.trackinfo[0].file)[0] as string

  return url
}

function extractThumbnail(document: Document): string {
  const link = document.querySelector('link[rel="image_src"]')

  if (!link) {
    throw new Error(`Can't find image_src link tag`)
  }

  const href = link.getAttribute('href')

  return href
}

const handleBandcamp = handleGET(async (req: VercelRequest, res: VercelResponse) => {
  const url = req.query.url

  if (!url || Array.isArray(url)) {
    res.status(400).json({
      error: 'Missing correct url query parameter'
    })
    return
  }

  const page = await fetchPage(decodeURIComponent(url))
  const trackId = extractTrackId(page)
  const streamUrl = extractStream(page)
  const thumbnail = extractThumbnail(page)

  res.status(200).json({
    trackId,
    streamUrl,
    thumbnail,
  })
})

export default handleBandcamp
