import { getMDXComponent } from "next-contentlayer/hooks";
import { JSDOM } from "jsdom";

import { Post } from "@cmd/domain-content";

export const excerpt = async (post: Post.Post) => {
  const MDXContent = getMDXComponent(post.content);

  // importing in async to prevent "You're importing a component that imports
  // react-dom/server. To fix it, render or return the content directly as a
  // Server Component instead for perf and security." warning
  const { default: ReactDOMServer } = await import("react-dom/server");
  const markup = ReactDOMServer.renderToStaticMarkup(<MDXContent />);

  const { document } = new JSDOM(markup).window;

  // take all paragraphs before the first h2
  const result = document.evaluate(".//h2[1]//preceding::p", document, null, 0);

  const nodes: Node[] = [];
  let node = result.iterateNext();

  while (node) {
    nodes.push(node);
    node = result.iterateNext();
  }

  return nodes.map((localNode) => localNode.textContent).join("\n");
};
