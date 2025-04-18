"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface CollectibleItemProps {
  id: string
  position: number
  collected: boolean
  onCollect: (id: string) => void
  rarity: string
}

export default function CollectibleItem({ id, position, collected, onCollect, rarity }: CollectibleItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Random floating animation start time
    const timeout = setTimeout(() => {
      setIsFloating(true)
    }, Math.random() * 2000)

    timeoutRef.current = timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (collected) return null

  const getItemColor = () => {
    switch (rarity) {
      case "COMMON":
        return "bg-gray-400 border-gray-600"
      case "UNCOMMON":
        return "bg-green-400 border-green-600"
      case "RARE":
        return "bg-blue-400 border-blue-600"
      case "EPIC":
        return "bg-purple-400 border-purple-600"
      case "LEGENDARY":
        return "bg-yellow-400 border-yellow-600"
      case "MYTHIC":
        return "bg-pink-400 border-pink-600"
      default:
        return "bg-gray-400 border-gray-600"
    }
  }

  const getItemShape = () => {
    if (id.includes("sword")) {
      return "w-4 h-10"
    } else if (id.includes("potion")) {
      return "rounded-t-full w-6 h-8"
    } else if (id.includes("key")) {
      return "w-8 h-4"
    } else {
      return "rotate-45 w-6 h-6"
    }
  }

  const getGlowEffect = () => {
    switch (rarity) {
      case "LEGENDARY":
        return "shadow-[0_0_15px_rgba(255,200,40,0.6)]"
      case "MYTHIC":
        return "shadow-[0_0_20px_rgba(255,100,160,0.7)]"
      case "EPIC":
        return "shadow-[0_0_10px_rgba(160,40,200,0.5)]"
      case "RARE":
        return "shadow-[0_0_8px_rgba(40,100,255,0.5)]"
      default:
        return ""
    }
  }

  const handleClick = () => {
    onCollect(id)
  }

  return (
    <div
      className={cn(
        "absolute bottom-12 border-2 border-black cursor-pointer",
        getItemColor(),
        getItemShape(),
        getGlowEffect(),
        isHovered ? "scale-125" : "scale-100",
        isFloating ? "animate-float" : "",
        rarity === "LEGENDARY" && "animate-pulse-subtle",
        "transition-all duration-300",
      )}
      style={{
        left: `${position}%`,
        boxShadow:
          rarity === "LEGENDARY" || rarity === "MYTHIC"
            ? `0 0 10px ${rarity === "LEGENDARY" ? "rgba(255, 215, 0, 0.7)" : "rgba(255, 105, 180, 0.7)"}`
            : "none",
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(rarity === "LEGENDARY" || rarity === "MYTHIC") && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              rarity === "LEGENDARY" ? "bg-yellow-300" : "bg-pink-300",
              "animate-ping opacity-70",
            )}
          ></div>
        </div>
      )}
    </div>
  )
}
