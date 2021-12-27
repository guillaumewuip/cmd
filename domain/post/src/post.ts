import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { JSDOM } from 'jsdom';

import { Metadata } from '@cmd/domain-metadata';

import * as Infos from './infos';

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

export type Post = Readonly<{
  infos: Infos.Infos,
  excerpt: string,
}>

export function create({
  fullName,
  createdAt,
  url,
  metadata,
  content,
}: {
  fullName: string,
  createdAt: string,
  url: string,
  metadata: Metadata.Metadata,
  content: string
}): Post {
  const infos = Infos.create({
    fullName,
    createdAt,
    url,
    metadata,
  })

  return {
    infos,
    excerpt: postExcerpt(content)
  }
}
