import React, { useEffect } from "react"
import styles from "./Toast.module.css"

interface ToastProps {
  message: string
  type: "success" | "error"
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const toastClasses = [
    styles.toast,
    styles[type],
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={styles.container}>
      <div className={toastClasses}>
        <div className={styles.icon}>
          {type === "success" ? "✓" : "✕"}
        </div>
        <div className={styles.content}>
          <span className={styles.message}>{message}</span>
        </div>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
} 