"use client"

import { useState, useRef } from "react"
import styles from "./viewer.module.css"
import Button from "../../components/Button/Button"
import StatusIndicator from "../../components/StatusIndicator/StatusIndicator"
import Toast from "../../components/Toast/Toast"

type ViewerState = "idle" | "connecting" | "connected" | "disconnected"

export default function ViewerPage() {
  const [viewerState, setViewerState] = useState<ViewerState>("idle")
  const [roomCode, setRoomCode] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const cameraVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const connectToRoom = async () => {
    if (!roomCode.trim()) {
      showToast("Please enter a room code", "error")
      return
    }

    try {
      setViewerState("connecting")

      // Set up WebRTC peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })

      peerConnection.ontrack = (event) => {
        if (event.track.kind === "video" && event.streams[0]) {
          // Try to distinguish between screen and camera by track label
          if (event.track.label.toLowerCase().includes("camera") && cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = event.streams[0]
          } else if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0]
          }
          setViewerState("connected")
          showToast("Connected to stream!", "success")
        }
      }

      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
          setViewerState("disconnected")
          showToast("Connection lost", "error")
        }
      }

      peerConnectionRef.current = peerConnection

      // Simulate connection process
      setTimeout(() => {
        // In a real implementation, this would involve signaling server
        // For demo purposes, we'll simulate a connection timeout
        if (viewerState === "connecting") {
          setViewerState("disconnected")
          showToast("Failed to connect - sharer may not be online", "error")
        }
      }, 5000)
    } catch (error) {
      console.error("Error connecting to room:", error)
      setViewerState("idle")
      showToast("Failed to connect to room", "error")
    }
  }

  const disconnect = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setViewerState("idle")
    showToast("Disconnected from stream", "success")
  }

  const getStatusText = () => {
    switch (viewerState) {
      case "connecting":
        return "Connecting..."
      case "connected":
        return "Connected"
      case "disconnected":
        return "Disconnected"
      default:
        return "Not Connected"
    }
  }

  const getStatusType = () => {
    switch (viewerState) {
      case "connected":
        return "success" as const
      case "connecting":
        return "warning" as const
      case "disconnected":
        return "error" as const
      default:
        return "idle" as const
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Stream Viewer</h1>
        <StatusIndicator status={getStatusText()} type={getStatusType()} />
      </div>

      <div className={styles.content}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            autoPlay
            className={styles.video}
            style={{ display: viewerState === "connected" ? "block" : "none" }}
          />
          {/* Small camera feed overlay */}
          <video
            ref={cameraVideoRef}
            autoPlay
            muted
            className={styles.cameraOverlay}
            style={{ display: viewerState === "connected" ? "block" : "none" }}
          />

          {viewerState === "idle" && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>👀</div>
              <p>Enter a room code to start viewing</p>
            </div>
          )}

          {viewerState === "connecting" && (
            <div className={styles.placeholder}>
              <div className={styles.spinner}></div>
              <p>Connecting to stream...</p>
            </div>
          )}

          {viewerState === "disconnected" && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>❌</div>
              <p>Stream ended or connection lost</p>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <div className={styles.inputGroup}>
            <label htmlFor="roomCode" className={styles.label}>
              Room Code
            </label>
            <input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter room code (e.g., ABC123)"
              className={styles.input}
              disabled={viewerState === "connected"}
              maxLength={6}
            />
          </div>

          <div className={styles.buttonGroup}>
            {viewerState === "idle" || viewerState === "disconnected" ? (
              <Button
                onClick={connectToRoom}
                variant="primary"
                size="large"
                disabled={!roomCode.trim()}
              >
                Join Stream
              </Button>
            ) : viewerState === "connecting" ? (
              <Button
                variant="primary"
                size="large"
                disabled
              >
                Connecting...
              </Button>
            ) : (
              <Button onClick={disconnect} variant="danger" size="large">
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
