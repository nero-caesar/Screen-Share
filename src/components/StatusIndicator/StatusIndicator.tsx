import React from "react"
import styles from "./StatusIndicator.module.css"

interface StatusIndicatorProps {
  status: string
  type: "idle" | "success" | "warning" | "error"
  className?: string
}

export default function StatusIndicator({ status, type, className }: StatusIndicatorProps) {
  const indicatorClasses = [
    styles.indicator,
    styles[type],
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={indicatorClasses}>
      <div className={styles.dot}></div>
      <span className={styles.text}>{status}</span>
    </div>
  )
} 