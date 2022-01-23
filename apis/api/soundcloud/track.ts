import type { VercelRequest, VercelResponse } from '@vercel/node';

import { parseHTML } from 'linkedom';

async function getSoundcloudTrackId(url: string) {
  const response = await fetch(url)
  const documentString = await response.text()

  const document = parseHTML(documentString).window.document

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const url = req.query.url

      if (!url || Array.isArray(url)) {
        res.status(400).json({
          error: 'Missing correct url query parameter'
        })
        return
      }

      const trackId = await getSoundcloudTrackId(decodeURIComponent(url))

      res.status(200).json({
        trackId
      })
      return
    }

    res.status(400)
    return
  } catch (error) {
    console.error(error)

    res.status(500)
    return
  }
}

