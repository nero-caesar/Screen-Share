import Link from "next/link"
import styles from "./load.module.css"

export default function Load() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Screen Share App</h1>
        <p className={styles.description}>Share your screen, camera, and microphone with others in real-time</p>

        <div className={styles.buttonGroup}>
          <Link href="/sharer" className={styles.primaryButton}>
            Start Sharing
          </Link>
          <Link href="/viewer" className={styles.secondaryButton}>
            Join Session
          </Link>
        </div>
      </div>
    </div>
  )
}
