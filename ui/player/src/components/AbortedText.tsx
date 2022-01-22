import { useMemo } from 'react'

import { Monospace } from '@cmd/ui-text'

const abortedMessages = [
  `Ooops. Quelque chose est cassé. Bravo Guillaume.`,
  `Bah alors? Y'a un truc qui ne marche plus.`,
  `Super ton petit blog Guillaume, mais c'est tout cassé.`,
  `Nos plus plates excuses, quelque chose ne fonctione pas bien.`,
  `Encore un truc HS, merci Guillaume.`,
]

const randomAbortedMessage = () => abortedMessages[Math.floor(Math.random() * abortedMessages.length)]

export default function AbortedText() {
  const message = useMemo(randomAbortedMessage, [])

  return (
    <Monospace>{message}</Monospace>
  )
}

