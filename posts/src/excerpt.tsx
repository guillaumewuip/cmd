import { getMDXComponent } from "next-contentlayer/hooks";
import { JSDOM } from "jsdom";

export const excerpt = async ({ content }: { content: string }) => {
  const MDXContent = getMDXComponent(content);

  // importing in async to prevent "You're importing a component that imports
  // react-dom/server. To fix it, render or return the content directly as a
  // Server Component instead for perf and security." warning
  const { default: ReactDOMServer } = await import("react-dom/server");
  const markup = ReactDOMServer.renderToStaticMarkup(
    <div id="root">
      <MDXContent />
    </div>
  );

  const { document } = new JSDOM(markup).window;

  // take all paragraphs before the first h2
  // const result = document.evaluate(".//h2[1]//preceding::p", document, null, 0);
  const result = document.evaluate(
    ".//p[parent::div[@id='root']][not(preceding-sibling::h2) or count(preceding-sibling::h2) = 0]",
    document,
    null,
    0
  );

  const nodes: Node[] = [];
  let node = result.iterateNext();

  while (node) {
    nodes.push(node);
    node = result.iterateNext();
  }

  const text = nodes.map((localNode) => localNode.textContent).join("\n");

  return text;
};
