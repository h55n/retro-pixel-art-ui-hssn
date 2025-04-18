"use client"

import { useRef, useEffect } from "react"

interface SoundEffectProps {
  play: boolean
  onComplete?: () => void
  type: "collect" | "move" | "select" | "error"
  volume?: number
}

export default function SoundEffect({ play, onComplete, type, volume = 0.3 }: SoundEffectProps) {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Only create the audio context when needed to avoid initialization issues
    if (play && !audioContextRef.current) {
      try {
        // Browser compatibility check
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContext) {
          audioContextRef.current = new AudioContext()
        } else {
          console.warn("AudioContext not supported in this browser")
          if (onComplete) onComplete()
          return
        }
      } catch (error) {
        console.error("AudioContext could not be created:", error)
        if (onComplete) onComplete()
        return
      }
    }

    if (!play || !audioContextRef.current) return

    let oscillator: OscillatorNode | null = null
    let gainNode: GainNode | null = null

    try {
      const context = audioContextRef.current
      oscillator = context.createOscillator()
      gainNode = context.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Configure sound based on type
      switch (type) {
        case "collect":
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(660, context.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.1)

          gainNode.gain.setValueAtTime(volume, context.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3)

          oscillator.start()
          oscillator.stop(context.currentTime + 0.3)
          break

        case "move":
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(330, context.currentTime)

          gainNode.gain.setValueAtTime(volume * 0.3, context.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1)

          oscillator.start()
          oscillator.stop(context.currentTime + 0.1)
          break

        case "select":
          oscillator.type = "triangle"
          oscillator.frequency.setValueAtTime(440, context.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(550, context.currentTime + 0.15)

          gainNode.gain.setValueAtTime(volume, context.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2)

          oscillator.start()
          oscillator.stop(context.currentTime + 0.2)
          break

        case "error":
          oscillator.type = "sawtooth"
          oscillator.frequency.setValueAtTime(220, context.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(110, context.currentTime + 0.2)

          gainNode.gain.setValueAtTime(volume, context.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3)

          oscillator.start()
          oscillator.stop(context.currentTime + 0.3)
          break
      }

      // Cleanup and callback when done
      oscillator.onended = () => {
        if (onComplete) onComplete()

        // Clean up references
        oscillator = null
        gainNode = null
      }
    } catch (e) {
      console.error("Error during audio playback:", e)
      if (onComplete) onComplete()

      // Clean up references on error
      oscillator = null
      gainNode = null
    }

    return () => {
      try {
        // Ensure oscillator is stopped if component unmounts during playback
        if (oscillator && oscillator.state === "running") {
          oscillator.stop()
        }
      } catch (e) {
        // Handle any errors during cleanup
        console.error("Error during audio cleanup:", e)
      }
    }
  }, [play, type, volume, onComplete])

  return null
}
