import * as Option from 'fp-ts/Option'
import { pipe } from 'fp-ts/function';

export function previousTitle(id: string): Option.Option<string> {
  const element = document.getElementById(id)

  let preceding: Element | null = element

  while (preceding) {
    if (preceding.tagName === 'H2') {
      return pipe(
        preceding,
        Option.some,
        Option.map(node => node.textContent),
        Option.chain(Option.fromNullable),
      )
    }

    preceding = preceding.previousElementSibling
  }

  return Option.none
}
