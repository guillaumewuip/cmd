export function position(id: string): number {
  const result = document.evaluate(
    `count(.//div[@id='${id}']//preceding::h2)`,
    document,
    null,
    XPathResult.NUMBER_TYPE,
    null,
  )

  return result.numberValue
}
