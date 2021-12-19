import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';
import classnames from 'classnames'

import styles from './styles.module.scss'

export function Paragraph({
  children,
  centered,
  inverted,
  noMargin,
} : {
  children: React.ReactNode,
  centered?: boolean,
  inverted?: boolean,
  noMargin?: boolean
}) {
  return (
    <p className={classnames(
      styles.paragraph,
      {
        [styles.centered]: centered,
        [styles.inverted]: inverted,
        [styles.noMargin]: noMargin,
      }
    )}>
      {children}
    </p>
  )
}

export function Small({ children } : { children: React.ReactNode }) {
  return <p className={styles.small}>{children}</p>
}

export function MainTitle() {
  const [showAnim, setShowAnim] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAnim(true)
    }, 6000)

    return () => {
      clearTimeout(timeout)
    }
  }, [setShowAnim])

  return (
    <h1 className={styles.mainTitle} aria-label="cerfeuil et musique douce">
      {showAnim ? <Typewriter
        options={{
          loop: true
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString('cerfeuil et musique douce')
            .pauseFor(5000)
            .deleteAll()
            .typeString('cmd')
            .pauseFor(20000)
            .start();
        }}
      /> : "cerfeuil et musique douce"}
      </h1>
  )
}

export function H1({ children } : { children: React.ReactNode }) {
  return <h1 className={styles.h1}>{children}</h1>
}

export function H2({ children } : { children: React.ReactNode }) {
  return <h2 className={styles.h2}>{children}</h2>
}

export function H3({ children } : { children: React.ReactNode }) {
  return <h3 className={styles.h3}>{children}</h3>
}

export function Code({ children } : { children: React.ReactNode }) {
  return <code className={styles.code}>{children}</code>
}

export function Blockquote({ children } : { children: React.ReactNode }) {
  return <blockquote className={styles.blockquote}>{children}</blockquote>
}