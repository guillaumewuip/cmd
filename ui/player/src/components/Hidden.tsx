import React from 'react'
import * as styles from './Hidden.css'

export function VisuallyHidden({ children } : React.PropsWithChildren<{}>) {
  return (
    <div className={styles.hidden}>
      {children}
    </div>
  )
}

export function VisuallyAndAriaHidden({ children } : React.PropsWithChildren<{}>) {
  return (
    <div className={styles.hidden} aria-hidden={true} tabIndex={-1}>
      {children}
    </div>
  )
}
