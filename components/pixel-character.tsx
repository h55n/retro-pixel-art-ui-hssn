"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface PixelCharacterProps {
  position: number
  isMoving: boolean
}

export default function PixelCharacter({ position, isMoving }: PixelCharacterProps) {
  const [frame, setFrame] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = right, -1 = left
  const [lastPosition, setLastPosition] = useState(position)
  const [jumpState, setJumpState] = useState<"idle" | "jumping" | "falling">("idle")
  const [jumpHeight, setJumpHeight] = useState(0)

  // Use refs to track intervals for proper cleanup
  const jumpIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Animation frames based on movement
  useEffect(() => {
    // Clear any existing interval first
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current)
    }

    const interval = setInterval(
      () => {
        setFrame((prev) => (prev + 1) % 4)
      },
      isMoving ? 150 : 400,
    ) // Faster animation when moving, slower when idle

    animationIntervalRef.current = interval

    return () => {
      clearInterval(interval)
      animationIntervalRef.current = null
    }
  }, [isMoving])

  // Track direction
  useEffect(() => {
    if (position !== lastPosition) {
      setDirection(position > lastPosition ? 1 : -1)
      setLastPosition(position)
    }
  }, [position, lastPosition])

  // Jump animation effect
  useEffect(() => {
    // Clear any existing interval first
    if (jumpIntervalRef.current) {
      clearInterval(jumpIntervalRef.current)
      jumpIntervalRef.current = null
    }

    let interval: NodeJS.Timeout | null = null

    if (jumpState === "jumping") {
      interval = setInterval(() => {
        setJumpHeight((prev) => {
          if (prev >= 20) {
            setJumpState("falling")
            return prev
          }
          return prev + 4
        })
      }, 50)
    } else if (jumpState === "falling") {
      interval = setInterval(() => {
        setJumpHeight((prev) => {
          if (prev <= 0) {
            setJumpState("idle")
            return 0
          }
          return prev - 3
        })
      }, 50)
    }

    if (interval) {
      jumpIntervalRef.current = interval
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [jumpState])

  // Keyboard event to initiate jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "ArrowUp" || e.key === " ") && jumpState === "idle") {
        setJumpState("jumping")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [jumpState])

  return (
    <div
      className={cn("absolute w-12 h-16 transition-all duration-100", jumpState !== "idle" && "transition-none")}
      style={{
        left: `${position}%`,
        bottom: jumpHeight,
        transition: isMoving ? "left 0.1s ease-out" : "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className={cn(
          "w-full h-full relative",
          direction === -1 ? "scale-x-[-1]" : "",
          isMoving && "animate-[pulse_0.5s_ease-in-out_infinite]",
        )}
      >
        {/* Character Head */}
        <div className="absolute w-8 h-8 bg-orange-400 top-0 left-2 border-2 border-black rounded-sm"></div>

        {/* Character Eyes */}
        <div className="absolute w-2 h-2 bg-black top-3 left-3"></div>
        <div className="absolute w-2 h-2 bg-black top-3 left-7"></div>

        {/* Character Mouth - animated based on frame */}
        <div
          className="absolute w-4 h-1 bg-black top-6 left-4"
          style={{
            height: frame % 2 === 0 ? "1px" : "2px",
          }}
        ></div>

        {/* Character Body */}
        <div className="absolute w-10 h-6 bg-green-500 top-8 left-1 border-2 border-black transition-all duration-300"></div>

        {/* Character Legs - Animated */}
        <div
          className="absolute w-3 h-4 bg-blue-500 border-2 border-black transition-all duration-100"
          style={{
            bottom: 0,
            left: frame % 2 === 0 ? "2px" : "1px",
            height: isMoving ? (frame % 2 === 0 ? "4px" : "5px") : frame % 3 === 0 ? "4.5px" : "4px",
          }}
        ></div>
        <div
          className="absolute w-3 h-4 bg-blue-500 border-2 border-black transition-all duration-100"
          style={{
            bottom: 0,
            right: frame % 2 === 0 ? "1px" : "2px",
            height: isMoving ? (frame % 2 === 0 ? "5px" : "4px") : frame % 3 === 0 ? "4px" : "4.5px",
          }}
        ></div>
      </div>
    </div>
  )
}
