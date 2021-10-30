import { NextApiRequest, NextApiResponse} from 'next'

import { parse } from 'node-html-parser';

async function getBandcampTrackId(url: string) {
  const response = await fetch(url)
  const documentString = await response.text()

  const document = parse(documentString)

  const metaPagePropertiesElement = document.querySelector('meta[name="bc-page-properties"]')


  if (!metaPagePropertiesElement) {
    throw new Error(`Can't find bc-page-properties meta tag`)
  }

  const pageProperties = JSON.parse(metaPagePropertiesElement.attributes.content)

  if (!('item_id' in pageProperties)) {
    throw new Error(`Can't find item_id in page properties`)
  }

  return pageProperties.item_id
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const url = req.query.url

      if (!url || Array.isArray(url)) {
        res.status(400).json({
          error: 'Missing correct url query parameter'
        })
        return
      }

      const trackId = await getBandcampTrackId(decodeURIComponent(url))

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

