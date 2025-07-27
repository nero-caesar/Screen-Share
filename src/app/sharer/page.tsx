"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./sharer.module.css"
import Button from "../../components/Button/Button"
import StatusIndicator from "../../components/StatusIndicator/StatusIndicator"
import RoomCode from "../../components/RoomCode/RoomCode"
import Toast from "../../components/Toast/Toast"
import { generateRoomCode } from "../../lib/utils"

type SharingState = "idle" | "sharing" | "connecting"
type MediaType = "screen" | "camera" | "microphone"

export default function SharerPage() {
  const [sharingState, setSharingState] = useState<SharingState>("idle")
  const [roomCode, setRoomCode] = useState<string>("")
  const [activeMedia, setActiveMedia] = useState<Set<MediaType>>(new Set())
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    // Generate room code on component mount
    setRoomCode(generateRoomCode())
  }, [])

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const startSharing = async () => {
    try {
      setSharingState("connecting")

      // Get screen share
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      // Get camera if requested
      let cameraStream: MediaStream | null = null
      if (activeMedia.has("camera")) {
        try {
          cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
        } catch (err) {
          console.warn("Camera access denied:", err)
        }
      }

      // Get microphone if requested
      let micStream: MediaStream | null = null
      if (activeMedia.has("microphone")) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (err) {
          console.warn("Microphone access denied:", err)
        }
      }

      // Combine streams
      const combinedStream = new MediaStream()
      screenStream.getTracks().forEach((track) => combinedStream.addTrack(track))
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => combinedStream.addTrack(track))
      }
      if (micStream) {
        micStream.getTracks().forEach((track) => combinedStream.addTrack(track))
      }

      streamRef.current = combinedStream

      if (videoRef.current) {
        videoRef.current.srcObject = combinedStream
      }

      // Set up WebRTC peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })

      combinedStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, combinedStream)
      })

      peerConnectionRef.current = peerConnection
      setSharingState("sharing")
      showToast("Screen sharing started successfully!", "success")

      // Handle stream end
      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        stopSharing()
      })
    } catch (error) {
      console.error("Error starting screen share:", error)
      setSharingState("idle")
      showToast("Failed to start screen sharing", "error")
    }
  }

  const stopSharing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setSharingState("idle")
    showToast("Screen sharing stopped", "success")
  }

  const toggleMediaType = (mediaType: MediaType) => {
    const newActiveMedia = new Set(activeMedia)
    if (newActiveMedia.has(mediaType)) {
      newActiveMedia.delete(mediaType)
    } else {
      newActiveMedia.add(mediaType)
    }
    setActiveMedia(newActiveMedia)
  }

  const getStatusText = () => {
    switch (sharingState) {
      case "connecting":
        return "Connecting..."
      case "sharing":
        return "Sharing Active"
      default:
        return "Not Sharing"
    }
  }

  const getStatusType = () => {
    switch (sharingState) {
      case "sharing":
        return "success" as const
      case "connecting":
        return "warning" as const
      default:
        return "idle" as const
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Screen Sharer</h1>
        <StatusIndicator status={getStatusText()} type={getStatusType()} />
      </div>

      <div className={styles.content}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            autoPlay
            muted
            className={styles.video}
            style={{ display: sharingState === "sharing" ? "block" : "none" }}
          />
          {sharingState !== "sharing" && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>🖥️</div>
              <p>Your screen will appear here when sharing starts</p>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <div className={styles.mediaOptions}>
            <h3>Share Options:</h3>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={activeMedia.has("screen")}
                  onChange={() => toggleMediaType("screen")}
                  disabled={sharingState === "sharing"}
                />
                <span>Screen (Required)</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={activeMedia.has("camera")}
                  onChange={() => toggleMediaType("camera")}
                  disabled={sharingState === "sharing"}
                />
                <span>Camera</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={activeMedia.has("microphone")}
                  onChange={() => toggleMediaType("microphone")}
                  disabled={sharingState === "sharing"}
                />
                <span>Microphone</span>
              </label>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            {sharingState === "idle" && (
              <Button onClick={startSharing} variant="primary" size="large">
                Start Sharing
              </Button>
            )}
            {sharingState === "connecting" && (
              <Button variant="primary" size="large" disabled>
                Starting...
              </Button>
            )}
            {sharingState === "sharing" && (
              <Button onClick={stopSharing} variant="danger" size="large">
                Stop Sharing
              </Button>
            )}
          </div>
        </div>

        <RoomCode code={roomCode} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
