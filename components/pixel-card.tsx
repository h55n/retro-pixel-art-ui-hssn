"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface PixelCardProps {
  name: string
  rarity: string
  color: string
  collected: boolean
  onClick: () => void
  season?: string
  characterImage?: string
  isHighlighted?: boolean
}

export default function PixelCard({
  name,
  rarity,
  color,
  collected,
  onClick,
  season,
  characterImage,
  isHighlighted = false,
}: PixelCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getCardColor = () => {
    switch (color) {
      case "orange":
        return "bg-orange-500"
      case "yellow":
        return "bg-yellow-500"
      case "purple":
        return "bg-purple-500"
      case "green":
        return "bg-green-500"
      case "blue":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeasonColor = () => {
    switch (season) {
      case "SPRING":
        return "text-green-400"
      case "SUMMER":
        return "text-yellow-400"
      case "FALL":
        return "text-orange-400"
      case "WINTER":
        return "text-blue-400"
      default:
        return "text-white"
    }
  }

  const getRarityGlow = () => {
    switch (rarity) {
      case "COMMON":
        return "shadow-none"
      case "UNCOMMON":
        return "shadow-[0_0_10px_rgba(40,200,40,0.3)]"
      case "RARE":
        return "shadow-[0_0_15px_rgba(40,100,255,0.4)]"
      case "EPIC":
        return "shadow-[0_0_15px_rgba(160,40,200,0.5)]"
      case "LEGENDARY":
        return "shadow-[0_0_20px_rgba(255,200,40,0.6)]"
      case "MYTHIC":
        return "animate-glow shadow-[0_0_20px_rgba(255,100,160,0.5)]"
      default:
        return "shadow-none"
    }
  }

  return (
    <div
      className={cn(
        "pixel-card select-none",
        getCardColor(),
        collected ? "opacity-100" : "opacity-70",
        isHighlighted && "ring-4 ring-offset-2 ring-white ring-offset-black scale-105",
        getRarityGlow(),
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="flex justify-between items-center mb-1 px-1">
        <div className="font-bold text-xs tracking-wider">{name}</div>
        <div className="flex">
          {Array(
            rarity === "COMMON"
              ? 1
              : rarity === "UNCOMMON"
                ? 2
                : rarity === "RARE"
                  ? 3
                  : rarity === "EPIC"
                    ? 4
                    : rarity === "LEGENDARY"
                      ? 5
                      : 6,
          )
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className={cn(
                  "text-xs",
                  rarity === "LEGENDARY" && "text-yellow-300",
                  rarity === "MYTHIC" && "text-pink-300 animate-pulse-subtle",
                )}
              >
                ★
              </span>
            ))}
        </div>
      </div>

      {/* Card Image */}
      <div className="collectible-image h-32 group">
        {collected ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {characterImage ? (
              <div className="relative w-full h-full">
                {/* Grid background */}
                <div className="grid-bg"></div>

                {/* Character image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={cn(
                      `w-16 h-16 ${characterImage}`,
                      rarity === "LEGENDARY" && "animate-pulse-subtle",
                      rarity === "MYTHIC" && "animate-float",
                    )}
                  ></div>
                </div>

                {/* Technical specs */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300",
                    isHovered && "opacity-100",
                  )}
                >
                  <div className="absolute top-1 right-1 text-[6px] text-black">
                    ID-
                    {String(
                      rarity === "COMMON"
                        ? 1
                        : rarity === "UNCOMMON"
                          ? 2
                          : rarity === "RARE"
                            ? 3
                            : rarity === "EPIC"
                              ? 4
                              : rarity === "LEGENDARY"
                                ? 5
                                : 6,
                    ).padStart(3, "0")}
                  </div>
                  <div className="absolute bottom-1 left-1 text-[6px] text-black">PIXEL-{name}</div>
                  <div className="absolute bottom-1 right-1 text-[6px] text-black">2025</div>
                  <div className="absolute top-1 left-1">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 bg-black"></div>
            )}
            {season && (
              <div
                className={cn(
                  `absolute bottom-1 font-bold text-xs ${getSeasonColor()}`,
                  rarity === "LEGENDARY" && "animate-pulse-subtle",
                  rarity === "MYTHIC" && "text-shadow-sm",
                )}
              >
                {season}
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white text-xs">
            <div className="animate-pulse bg-purple-900 bg-opacity-50 px-3 py-1 rounded-sm">COLLECT ME</div>
          </div>
        )}
      </div>

      {/* Card Stats */}
      <div className="flex justify-between mt-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-4 h-4 bg-black flex items-center justify-center text-[8px]">
              {i * 2}
            </div>
          ))}
        </div>
        <div className="text-[8px] font-bold">
          NO.
          {String(
            rarity === "COMMON"
              ? 1
              : rarity === "UNCOMMON"
                ? 2
                : rarity === "RARE"
                  ? 3
                  : rarity === "EPIC"
                    ? 4
                    : rarity === "LEGENDARY"
                      ? 5
                      : 6,
          ).padStart(3, "0")}
        </div>
      </div>
    </div>
  )
}
