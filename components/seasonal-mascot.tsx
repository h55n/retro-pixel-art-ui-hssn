"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SeasonalMascotProps {
  id: string
  position: number
  collected: boolean
  onCollect: (id: string) => void
  season: string
  color: string
  level: number
  currentLevel: number
}

export default function SeasonalMascot({
  id,
  position,
  collected,
  onCollect,
  season,
  color,
  level,
  currentLevel,
}: SeasonalMascotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [animation, setAnimation] = useState<"idle" | "bounce" | "spin">("idle")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isVisible = level === currentLevel && !collected

  // Cycle through animations - this hook must be called unconditionally
  useEffect(() => {
    // Clean up any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Only set up the animation if the mascot is visible
    if (isVisible) {
      const id = setInterval(() => {
        setAnimation((prev) => {
          if (prev === "idle") return "bounce"
          if (prev === "bounce") return "spin"
          return "idle"
        })
      }, 5000)

      intervalRef.current = id
    }

    // Clean up function that always runs
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isVisible]) // Only depend on isVisible, not level, currentLevel, collected directly

  // If the mascot shouldn't be shown, render nothing but still call all hooks
  if (!isVisible) return null

  const getColorClass = () => {
    switch (color) {
      case "green":
        return "bg-green-400"
      case "teal":
        return "bg-teal-400"
      case "orange":
        return "bg-orange-400"
      case "blue":
        return "bg-blue-400"
      default:
        return "bg-gray-400"
    }
  }

  const getAnimationClass = () => {
    switch (animation) {
      case "bounce":
        return "animate-[bounce_2s_ease-in-out_infinite]"
      case "spin":
        return "animate-[spin_3s_linear_infinite]"
      default:
        return "animate-float"
    }
  }

  const getSeasonGlow = () => {
    switch (season) {
      case "SPRING":
        return "shadow-[0_0_15px_rgba(40,200,40,0.6)]"
      case "SUMMER":
        return "shadow-[0_0_15px_rgba(255,200,40,0.6)]"
      case "FALL":
        return "shadow-[0_0_15px_rgba(255,100,40,0.6)]"
      case "WINTER":
        return "shadow-[0_0_15px_rgba(40,100,255,0.6)]"
      default:
        return ""
    }
  }

  return (
    <div
      className={cn(
        "absolute bottom-12 w-12 h-12 cursor-pointer",
        getAnimationClass(),
        isHovered ? "scale-125" : "scale-100",
        "transition-all duration-300",
      )}
      style={{ left: `${position}%` }}
      onClick={() => onCollect(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(`w-full h-full relative ${getColorClass()} border-2 border-black`, getSeasonGlow())}>
        {/* Mascot shape - triangular/mountain shape */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[24px] border-transparent border-b-current transform transition-transform duration-300"></div>
        </div>

        {/* Eyes - animated */}
        <div
          className={cn(
            "absolute top-4 left-3 w-2 h-2 bg-black rounded-full",
            animation === "spin" && "animate-pulse-subtle",
          )}
        ></div>
        <div
          className={cn(
            "absolute top-4 right-3 w-2 h-2 bg-black rounded-full",
            animation === "spin" && "animate-pulse-subtle",
          )}
        ></div>

        {/* Smile - animated */}
        <div
          className={cn(
            "absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-2 border-b-2 border-black rounded-full",
            animation === "bounce" && "animate-pulse-subtle",
          )}
        ></div>
      </div>

      {/* Floating label */}
      <div
        className={cn(
          "absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black px-2 py-1 text-xs whitespace-nowrap",
          isHovered ? "opacity-100" : "opacity-80",
          "transition-opacity duration-300",
          getSeasonGlow(),
        )}
      >
        {season}
      </div>
    </div>
  )
}
