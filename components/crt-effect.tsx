"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CRTEffectProps {
  intensity?: "low" | "medium" | "high"
}

export default function CRTEffect({ intensity = "medium" }: CRTEffectProps) {
  const [mounted, setMounted] = useState(false)

  // Mount effect with transition
  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)

    return () => {
      clearTimeout(timer)
      setMounted(false)
    }
  }, [])

  const getIntensityClass = (baseClass: string) => {
    switch (intensity) {
      case "low":
        return cn(baseClass, "opacity-40")
      case "high":
        return cn(baseClass, "opacity-85")
      default:
        return cn(baseClass, "opacity-65")
    }
  }

  return (
    <>
      {/* Subtle noise overlay */}
      <div
        className={cn("crt-overlay bg-black opacity-0 transition-opacity duration-500", mounted && "opacity-[0.02]")}
        aria-hidden="true"
      />

      {/* Scanlines */}
      <div
        className={cn(
          "crt-overlay crt-scanline opacity-0 transition-opacity duration-500",
          mounted && getIntensityClass(""),
        )}
        aria-hidden="true"
      />

      {/* Vignette/glow effect */}
      <div
        className={cn(
          "crt-overlay crt-glow opacity-0 transition-opacity duration-500",
          mounted && getIntensityClass(""),
        )}
        aria-hidden="true"
      />

      {/* Color separation effect */}
      <div
        className={cn(
          "crt-overlay crt-rgb opacity-0 transition-opacity duration-500",
          mounted && getIntensityClass(""),
        )}
        aria-hidden="true"
      />
    </>
  )
}
