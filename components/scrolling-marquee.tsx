"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ScrollingMarqueeProps {
  speed?: "slow" | "normal" | "fast"
  pauseOnHover?: boolean
}

export function ScrollingMarquee({ speed = "normal", pauseOnHover = true }: ScrollingMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const getSpeedClass = () => {
    switch (speed) {
      case "slow":
        return "animate-[marquee_30s_linear_infinite]"
      case "fast":
        return "animate-[marquee_15s_linear_infinite]"
      default:
        return "animate-[marquee_20s_linear_infinite]"
    }
  }

  // Handle visibility changes to pause animation when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true)
      } else if (!pauseOnHover) {
        setIsPaused(false)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pauseOnHover])

  return (
    <div
      className={cn(
        "bg-black border-y-4 border-purple-600 overflow-hidden py-1 relative",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-black before:via-transparent before:to-black before:z-10",
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={marqueeRef}
        className={cn("whitespace-nowrap", !isPaused && mounted && getSpeedClass(), isPaused && "animate-none")}
        aria-hidden="true" // Marquee content is decorative
      >
        <span className="mx-4 text-purple-500 font-bold pixel-text">COLLECT RARE PIXEL TREASURES</span>
        <span className="mx-4 text-green-500 font-bold pixel-text">DISCOVER MYTHIC CREATURES</span>
        <span className="mx-4 text-yellow-500 font-bold pixel-text">UNLOCK LEGENDARY ITEMS</span>
        <span className="mx-4 text-blue-500 font-bold pixel-text">COMPLETE YOUR COLLECTION</span>
        <span className="mx-4 text-pink-500 font-bold pixel-text">TRADE WITH FRIENDS</span>
        <span className="mx-4 text-orange-500 font-bold pixel-text">SHOWCASE YOUR RARITIES</span>
      </div>
    </div>
  )
}
