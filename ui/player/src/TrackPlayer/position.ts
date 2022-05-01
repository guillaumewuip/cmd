export function position(element: HTMLElement): number {
  const result = document.evaluate(
    `count(.//preceding::h2)`,
    element,
    null,
    XPathResult.NUMBER_TYPE,
    null
  );

  return result.numberValue;
}
