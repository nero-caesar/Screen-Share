/**
 * Generates a random 6-character room code
 * @returns A string of 6 uppercase letters and numbers
 */
export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Validates if a room code is in the correct format
 * @param code - The room code to validate
 * @returns True if the code is valid, false otherwise
 */
export function validateRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code)
}

/**
 * Formats a room code for display (adds spaces every 3 characters)
 * @param code - The room code to format
 * @returns The formatted room code
 */
export function formatRoomCode(code: string): string {
  return code.replace(/(.{3})/g, "$1 ").trim()
}

/**
 * Debounces a function call
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Checks if the browser supports the required WebRTC APIs
 * @returns True if WebRTC is supported, false otherwise
 */
export function isWebRTCSupported(): boolean {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof navigator.mediaDevices.getDisplayMedia === 'function' &&
    typeof window !== 'undefined' &&
    typeof window.RTCPeerConnection === 'function'
  )
}

/**
 * Gets the user's media devices
 * @returns A promise that resolves to the available media devices
 */
export async function getMediaDevices(): Promise<MediaDeviceInfo[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices
  } catch (error) {
    console.error("Error getting media devices:", error)
    return []
  }
} 