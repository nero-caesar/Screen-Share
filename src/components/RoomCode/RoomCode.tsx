import React, { useState } from "react"
import styles from "./RoomCode.module.css"

interface RoomCodeProps {
  code: string
  className?: string
}

export default function RoomCode({ code, className }: RoomCodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy room code:", err)
    }
  }

  const roomCodeClasses = [
    styles.container,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={roomCodeClasses}>
      <div className={styles.header}>
        <h3 className={styles.title}>Room Code</h3>
        <span className={styles.subtitle}>Share this code with viewers</span>
      </div>
      
      <div className={styles.codeContainer}>
        <div className={styles.code}>{code}</div>
        <button
          onClick={copyToClipboard}
          className={styles.copyButton}
          title="Copy room code"
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>
    </div>
  )
} 