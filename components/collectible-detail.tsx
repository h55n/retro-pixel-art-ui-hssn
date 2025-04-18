"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SoundEffect from "@/components/sound-effect"

interface CollectibleDetailProps {
  collectible: {
    id: string
    name: string
    rarity: string
    type: string
    description: string
    attributes: Record<string, any>
    year: number
    edition: string
    category?: string
    color?: string
    season?: string
  }
  collected: boolean
  onCollect: (id: string) => void
}

export default function CollectibleDetail({ collectible, collected, onCollect }: CollectibleDetailProps) {
  const [isRotating, setIsRotating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [playSound, setPlaySound] = useState(false)
  const [isCollecting, setIsCollecting] = useState(false)
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const collectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const rarityColors = {
    COMMON: "rarity-common",
    UNCOMMON: "rarity-uncommon",
    RARE: "rarity-rare",
    EPIC: "rarity-epic",
    LEGENDARY: "rarity-legendary",
    MYTHIC: "rarity-mythic",
  }

  // Auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRotating(true)
      const timeout = setTimeout(() => setIsRotating(false), 2000)

      // Clean up the timeout if component unmounts
      return () => clearTimeout(timeout)
    }, 8000)

    rotationIntervalRef.current = interval

    return () => {
      clearInterval(interval)
      rotationIntervalRef.current = null
    }
  }, [])

  const handleCollect = () => {
    if (!collected && !isCollecting) {
      setIsCollecting(true)
      setPlaySound(true)

      // Animation time before calling the actual collect function
      const timeout = setTimeout(() => {
        onCollect(collectible.id)
        setIsCollecting(false)
      }, 1000)

      collectTimeoutRef.current = timeout
    }
  }

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (collectTimeoutRef.current) {
        clearTimeout(collectTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        className={cn(
          "border-4 border-black p-4 aspect-square flex items-center justify-center",
          rarityColors[collectible.rarity as keyof typeof rarityColors],
          isRotating && "transition-all duration-2000 transform rotate-y-180",
          (collectible.rarity === "LEGENDARY" || collectible.rarity === "MYTHIC") && "animate-pulse-subtle",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full">
          {/* Grid background */}
          <div className="grid-bg"></div>

          {/* Collectible visualization */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-transform duration-500",
              isHovered && "scale-110",
              isCollecting && "animate-[ping_1s_ease-in-out]",
            )}
          >
            {collectible.category === "MASCOTS" ? (
              <div
                className={cn(
                  "w-48 h-48 relative",
                  collectible.color === "green"
                    ? "bg-green-400"
                    : collectible.color === "teal"
                      ? "bg-teal-400"
                      : collectible.color === "orange"
                        ? "bg-orange-400"
                        : "bg-blue-400",
                  isRotating ? "animate-[spin_2s_ease-in-out]" : "animate-float",
                  isCollecting && "animate-[ping_1s_ease-in-out]",
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-b-[100px] border-transparent border-b-black"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
                  <div className="flex gap-16">
                    <div className="w-8 h-8 bg-black rounded-full"></div>
                    <div className="w-8 h-8 bg-black rounded-full"></div>
                  </div>
                  <div className="mt-8 w-24 h-6 border-b-4 border-black rounded-full"></div>
                </div>
              </div>
            ) : collectible.category === "ITEMS" ? (
              <div className="flex items-center justify-center">
                {collectible.id === "pixel-sword" ? (
                  <div
                    className={cn(
                      "w-24 h-64 bg-gray-300 relative",
                      isHovered && "animate-[pulse_2s_ease-in-out_infinite]",
                    )}
                  >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-16 bg-yellow-500"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-24 bg-yellow-800"></div>
                  </div>
                ) : collectible.id === "mana-potion" ? (
                  <div
                    className={cn(
                      "w-32 h-48 bg-blue-400 rounded-t-full relative",
                      isHovered && "animate-[pulse_2s_ease-in-out_infinite]",
                    )}
                  >
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-blue-200"></div>
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-blue-600"></div>
                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-blue-600"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-blue-600"></div>
                  </div>
                ) : collectible.id === "golden-key" ? (
                  <div className={cn("w-48 h-32 bg-yellow-500 relative", isHovered && "animate-glow")}>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-24 h-16 bg-yellow-500 border-4 border-black rounded-full"></div>
                    <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-yellow-700"></div>
                    <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 w-4 h-12 bg-yellow-700"></div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "w-32 h-32 bg-red-400 rotate-45 relative",
                      isHovered && "animate-[pulse_2s_ease-in-out_infinite]",
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-300 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "w-48 h-48 rounded-full relative",
                  collectible.color === "orange"
                    ? "bg-orange-400"
                    : collectible.color === "yellow"
                      ? "bg-yellow-400"
                      : collectible.color === "purple"
                        ? "bg-purple-400"
                        : "bg-green-400",
                  isRotating ? "animate-[bounce_1s_ease-in-out_infinite]" : "animate-float",
                )}
              >
                <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-black rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-black rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-24 h-8 border-b-4 border-black rounded-full"></div>
              </div>
            )}
          </div>

          {!collected && !isCollecting && (
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-black bg-opacity-70",
                "transition-opacity duration-300",
                isHovered ? "opacity-90" : "opacity-70",
              )}
            >
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md animate-pulse-subtle transform transition-transform duration-300 hover:scale-110"
                onClick={handleCollect}
              >
                UNLOCK COLLECTIBLE
              </Button>
            </div>
          )}

          {isCollecting && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-2xl font-bold text-white animate-ping">COLLECTING...</div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold pixel-text">{collectible.name}</h2>
          <div className={cn("rarity-badge", rarityColors[collectible.rarity as keyof typeof rarityColors])}>
            {collectible.rarity}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm bg-gray-900 bg-opacity-50 p-3 rounded-md">
          <div className="text-gray-400 font-semibold">TYPE</div>
          <div>{collectible.type}</div>

          <div className="text-gray-400 font-semibold">EDITION</div>
          <div>{collectible.edition}</div>

          <div className="text-gray-400 font-semibold">YEAR</div>
          <div>{collectible.year}</div>

          {collectible.season && (
            <>
              <div className="text-gray-400 font-semibold">SEASON</div>
              <div
                className={cn(
                  collectible.season === "SPRING"
                    ? "text-green-400"
                    : collectible.season === "SUMMER"
                      ? "text-yellow-400"
                      : collectible.season === "FALL"
                        ? "text-orange-400"
                        : "text-blue-400",
                  "font-semibold",
                )}
              >
                {collectible.season}
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-900 bg-opacity-30 p-3 rounded-md">
          <div className="text-gray-400 font-semibold mb-2">DESCRIPTION</div>
          <p className="text-sm leading-relaxed">{collectible.description}</p>
        </div>

        <div className="bg-gray-900 bg-opacity-30 p-3 rounded-md">
          <div className="text-gray-400 font-semibold mb-2">ATTRIBUTES</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(collectible.attributes).map(([key, value]) => (
              <div key={key} className="bg-gray-800 p-2 rounded hover:bg-gray-700 transition-colors duration-200">
                <div className="text-xs text-gray-400 uppercase font-bold">{key}</div>
                <div className="text-sm font-bold mt-1">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-xs opacity-70">ID: {collectible.id}</div>
            <div
              className={cn(
                "text-xs px-2 py-1 rounded-sm",
                collected ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300",
              )}
            >
              {collected ? "COLLECTED" : "NOT COLLECTED"}
            </div>
          </div>
        </div>
      </div>

      {/* Sound effect for collecting */}
      <SoundEffect play={playSound} type="collect" onComplete={() => setPlaySound(false)} />
    </div>
  )
}
