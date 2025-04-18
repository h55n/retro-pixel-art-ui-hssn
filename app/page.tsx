"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Info, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import PixelCharacter from "@/components/pixel-character"
import CollectibleItem from "@/components/collectible-item"
import CRTEffect from "@/components/crt-effect"
import { ScrollingMarquee } from "@/components/scrolling-marquee"
import SeasonalMascot from "@/components/seasonal-mascot"
import CollectibleDetail from "@/components/collectible-detail"
import SoundEffect from "@/components/sound-effect"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [collected, setCollected] = useState<string[]>([])
  const [showCRT, setShowCRT] = useState(true)
  const [crtIntensity, setCrtIntensity] = useState<"low" | "medium" | "high">("low")
  const [muted, setMuted] = useState(false)
  const [characterPosition, setCharacterPosition] = useState(20)
  const [isMoving, setIsMoving] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [activeTab, setActiveTab] = useState("game")
  const [selectedCollectible, setSelectedCollectible] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeRarity, setActiveRarity] = useState<string | null>(null)
  const [playCollectSound, setPlayCollectSound] = useState(false)
  const [playMoveSound, setPlayMoveSound] = useState(false)
  const [playSelectSound, setPlaySelectSound] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [lastCollectedItem, setLastCollectedItem] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Refs for cleanup
  const movementTimerRef = useRef<NodeJS.Timeout | null>(null)
  const keyPressedRef = useRef<Record<string, boolean>>({})
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const levelChangeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const totalLevels = 4

  // Initial page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1000)

    loadingTimerRef.current = timer

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
      }
    }
  }, [])

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("pixelmonCollectState")
      if (savedState) {
        const { collected, score, currentLevel } = JSON.parse(savedState)
        setCollected(collected || [])
        setScore(score || 0)
        setCurrentLevel(currentLevel || 1)
      }
    } catch (err) {
      console.error("Error loading saved state:", err)
      // Non-critical error, don't show to user
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      const state = {
        collected,
        score,
        currentLevel,
      }
      localStorage.setItem("pixelmonCollectState", JSON.stringify(state))
    } catch (err) {
      console.error("Error saving state:", err)
    }
  }, [collected, score, currentLevel])

  // Error handling
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null)
      }, 5000)

      errorTimeoutRef.current = timeout

      return () => {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current)
        }
      }
    }
  }, [error])

  // Expanded collectibles with more detailed attributes
  const collectibles = [
    {
      id: "pixel-sword",
      name: "PIXEL SWORD",
      rarity: "RARE",
      position: 30,
      type: "WEAPON",
      description: "A legendary pixel sword forged in the digital realm.",
      attributes: {
        attack: 75,
        durability: 120,
        speed: 65,
      },
      year: 2025,
      edition: "Genesis",
    },
    {
      id: "mana-potion",
      name: "MANA POTION",
      rarity: "UNCOMMON",
      position: 50,
      type: "CONSUMABLE",
      description: "Restores magical energy with a fizzy pixel brew.",
      attributes: {
        mana: 50,
        duration: 30,
        cooldown: 60,
      },
      year: 2025,
      edition: "Genesis",
    },
    {
      id: "golden-key",
      name: "GOLDEN KEY",
      rarity: "LEGENDARY",
      position: 70,
      type: "KEY ITEM",
      description: "Unlocks the most precious pixel treasures.",
      attributes: {
        unlock: 100,
        durability: "Infinite",
        value: 1000,
      },
      year: 2025,
      edition: "Genesis",
    },
    {
      id: "health-crystal",
      name: "HEALTH CRYSTAL",
      rarity: "COMMON",
      position: 85,
      type: "CONSUMABLE",
      description: "A crystallized pixel of pure life energy.",
      attributes: {
        health: 25,
        uses: 3,
        glow: "Red",
      },
      year: 2025,
      edition: "Genesis",
    },
  ]

  // Seasonal special collectibles
  const seasonalMascots = [
    {
      id: "mascot-spring",
      position: 15,
      season: "SPRING",
      color: "green",
      name: "CHUNCHUN",
      rarity: "MYTHIC",
      type: "MASCOT",
      description: "The guardian of pixel spring, brings growth and renewal.",
      attributes: {
        element: "Nature",
        power: 95,
        season: "Spring",
      },
      year: 2025,
      edition: "Seasonal",
    },
    {
      id: "mascot-summer",
      position: 40,
      season: "SUMMER",
      color: "teal",
      name: "XTAXTANG",
      rarity: "MYTHIC",
      type: "MASCOT",
      description: "Master of summer pixels, controls heat and light.",
      attributes: {
        element: "Fire",
        power: 98,
        season: "Summer",
      },
      year: 2025,
      edition: "Seasonal",
    },
    {
      id: "mascot-fall",
      position: 65,
      season: "FALL",
      color: "orange",
      name: "QIUMING",
      rarity: "MYTHIC",
      type: "MASCOT",
      description: "The autumn pixel keeper, brings harvest and change.",
      attributes: {
        element: "Earth",
        power: 92,
        season: "Fall",
      },
      year: 2025,
      edition: "Seasonal",
    },
    {
      id: "mascot-winter",
      position: 85,
      season: "WINTER",
      color: "blue",
      name: "DONGSHAN",
      rarity: "MYTHIC",
      type: "MASCOT",
      description: "The winter pixel guardian, master of frost and snow.",
      attributes: {
        element: "Ice",
        power: 97,
        season: "Winter",
      },
      year: 2025,
      edition: "Seasonal",
    },
  ]

  // Expanded pixel collectible cards
  const pixelCards = [
    {
      id: "card-fox",
      name: "PIXEL FOX",
      rarity: "RARE",
      color: "orange",
      type: "CREATURE",
      description: "A mischievous digital fox that can phase through pixel walls.",
      attributes: {
        speed: 85,
        stealth: 70,
        luck: 90,
      },
      year: 2025,
      edition: "Creatures",
    },
    {
      id: "card-lion",
      name: "CYBER LION",
      rarity: "LEGENDARY",
      color: "yellow",
      type: "CREATURE",
      description: "King of the digital savanna, with a roar that crashes systems.",
      attributes: {
        strength: 95,
        leadership: 100,
        courage: 90,
      },
      year: 2025,
      edition: "Creatures",
    },
    {
      id: "card-wolf",
      name: "PIXEL WOLF",
      rarity: "EPIC",
      color: "purple",
      type: "CREATURE",
      description: "A lone wolf made of pixels that howls at the digital moon.",
      attributes: {
        pack: 80,
        hunting: 85,
        night: 95,
      },
      year: 2025,
      edition: "Creatures",
    },
    {
      id: "card-panda",
      name: "NEON PANDA",
      rarity: "UNCOMMON",
      color: "green",
      type: "CREATURE",
      description: "A peaceful pixel panda that glows in the dark.",
      attributes: {
        calm: 100,
        glow: 75,
        bamboo: 90,
      },
      year: 2025,
      edition: "Creatures",
    },
  ]

  // Combine all collectibles for the showcase
  const allCollectibles = [
    ...collectibles.map((item) => ({
      ...item,
      category: "ITEMS",
    })),
    ...seasonalMascots.map((mascot) => ({
      ...mascot,
      category: "MASCOTS",
    })),
    ...pixelCards.map((card) => ({
      ...card,
      category: "CREATURES",
    })),
  ]

  const handleCollect = useCallback(
    (id: string) => {
      if (!collected.includes(id)) {
        setCollected((prev) => [...prev, id])
        setScore((prev) => prev + 100)
        setLastCollectedItem(id)

        // Show collection notification
        setPlayCollectSound(true)

        // Check if all items in current level are collected
        const levelItems = [
          ...collectibles.filter(() => true),
          ...seasonalMascots.filter((mascot) => mascot.level === currentLevel),
        ]

        const levelItemIds = levelItems.map((item) => item.id)
        const collectedLevelItems = levelItemIds.filter((id) => collected.includes(id))

        if (collectedLevelItems.length === levelItemIds.length - 1) {
          // Last item collected, show level completion message
          if (currentLevel < totalLevels) {
            const timer = setTimeout(() => {
              setCurrentLevel((prev) => prev + 1)
            }, 2000)

            levelChangeTimerRef.current = timer
          }
        }
      }
    },
    [collected, currentLevel, collectibles, seasonalMascots, totalLevels],
  )

  // Smooth movement system with error handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyPressedRef.current[e.key] = true

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        if (!isMoving) {
          setIsMoving(true)
        }

        if (movementTimerRef.current === null) {
          movementTimerRef.current = setInterval(() => {
            try {
              if (keyPressedRef.current["ArrowRight"] && characterPosition < 85) {
                setCharacterPosition((prev) => prev + 2)
                if (!muted && Math.random() > 0.7) {
                  setPlayMoveSound(true)
                }
              } else if (keyPressedRef.current["ArrowLeft"] && characterPosition > 5) {
                setCharacterPosition((prev) => prev - 2)
                if (!muted && Math.random() > 0.7) {
                  setPlayMoveSound(true)
                }
              }

              // Check for collectible collection
              collectibles.forEach((item) => {
                if (Math.abs(characterPosition - item.position) < 10 && !collected.includes(item.id)) {
                  handleCollect(item.id)
                }
              })

              // Check for seasonal mascot collection
              seasonalMascots.forEach((mascot) => {
                if (
                  mascot.level === currentLevel &&
                  Math.abs(characterPosition - mascot.position) < 10 &&
                  !collected.includes(mascot.id)
                ) {
                  handleCollect(mascot.id)
                }
              })
            } catch (err) {
              console.error("Error in movement handler:", err)
              setError("Movement error occurred. Please refresh the page.")

              // Clean up on error
              if (movementTimerRef.current) {
                clearInterval(movementTimerRef.current)
                movementTimerRef.current = null
              }
            }
          }, 50)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keyPressedRef.current[e.key] = false

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        if (!keyPressedRef.current["ArrowRight"] && !keyPressedRef.current["ArrowLeft"]) {
          if (movementTimerRef.current) {
            clearInterval(movementTimerRef.current)
            movementTimerRef.current = null
          }
          setIsMoving(false)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (movementTimerRef.current) {
        clearInterval(movementTimerRef.current)
        movementTimerRef.current = null
      }
      if (levelChangeTimerRef.current) {
        clearTimeout(levelChangeTimerRef.current)
        levelChangeTimerRef.current = null
      }
    }
  }, [characterPosition, currentLevel, collected, muted, isMoving, collectibles, seasonalMascots, handleCollect])

  const changeLevel = useCallback(
    (direction: number) => {
      const newLevel = currentLevel + direction
      if (newLevel >= 1 && newLevel <= totalLevels) {
        setPlaySelectSound(true)
        setCurrentLevel(newLevel)
      }
    },
    [currentLevel, totalLevels],
  )

  const handleTabChange = useCallback(
    (value: string) => {
      if (value !== activeTab) {
        setPlaySelectSound(true)
        setActiveTab(value)
        setSelectedCollectible(null)
      }
    },
    [activeTab],
  )

  const getLevelBackground = () => {
    switch (currentLevel) {
      case 1:
        return "bg-gradient-to-b from-green-900 via-green-700 to-green-500" // Spring
      case 2:
        return "bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500" // Summer
      case 3:
        return "bg-gradient-to-b from-orange-900 via-orange-700 to-orange-500" // Fall
      case 4:
        return "bg-gradient-to-b from-indigo-900 via-indigo-700 to-indigo-500" // Winter
      default:
        return "bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500"
    }
  }

  const getLevelName = () => {
    switch (currentLevel) {
      case 1:
        return "SPRING REALM"
      case 2:
        return "SUMMER REALM"
      case 3:
        return "FALL REALM"
      case 4:
        return "WINTER REALM"
      default:
        return "UNKNOWN REALM"
    }
  }

  const filteredCollectibles = allCollectibles.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRarity = activeRarity ? item.rarity === activeRarity : true

    return matchesSearch && matchesRarity
  })

  const collectiblesRef = useRef(allCollectibles)

  useEffect(() => {
    collectiblesRef.current = allCollectibles
  }, [allCollectibles])

  const getCollectibleById = useCallback((id: string) => {
    return collectiblesRef.current.find((item) => item.id === id)
  }, [])

  const rarityColors = {
    COMMON: "rarity-common",
    UNCOMMON: "rarity-uncommon",
    RARE: "rarity-rare",
    EPIC: "rarity-epic",
    LEGENDARY: "rarity-legendary",
    MYTHIC: "rarity-mythic",
  }

  const raritiesTotalCounts = Object.entries(
    allCollectibles.reduce(
      (acc, curr) => {
        acc[curr.rarity] = (acc[curr.rarity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  )

  const rarityCollectedCounts = Object.entries(
    allCollectibles
      .filter((item) => collected.includes(item.id))
      .reduce(
        (acc, curr) => {
          acc[curr.rarity] = (acc[curr.rarity] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
  )

  const categoryTotalCounts = Object.entries(
    allCollectibles.reduce(
      (acc, curr) => {
        acc[curr.category as string] = (acc[curr.category as string] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  )

  const categoryCollectedCounts = Object.entries(
    allCollectibles
      .filter((item) => collected.includes(item.id))
      .reduce(
        (acc, curr) => {
          acc[curr.category as string] = (acc[curr.category as string] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
  )

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (selectedCollectible) {
        setSelectedCollectible(null)
        // Prevent default navigation
        window.history.pushState(null, "", window.location.pathname)
        return
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [selectedCollectible])

  // Add to history when selecting a collectible
  useEffect(() => {
    if (selectedCollectible) {
      window.history.pushState(null, "", window.location.pathname)
    }
  }, [selectedCollectible])

  return (
    <main
      className={cn(
        "relative min-h-screen bg-black text-white overflow-hidden font-mono",
        isPageLoading && "animate-pulse",
      )}
    >
      {showCRT && <CRTEffect intensity={crtIntensity} />}

      {/* Error notification */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-900 text-white px-4 py-2 rounded-md shadow-lg animate-in fade-in slide-in-from-top duration-300">
          {error}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 px-4 py-3 flex justify-between items-center border-b-4 border-black shadow-md">
        <div className="pixel-title tracking-wider">PIXELMON COLLECT</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="pixel-button"
            onClick={() => {
              setShowInfo(true)
              setPlaySelectSound(true)
            }}
            aria-label="Show information"
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="pixel-button"
            onClick={() => {
              setShowCRT(!showCRT)
              setPlaySelectSound(true)
            }}
            aria-label={showCRT ? "Turn CRT effect off" : "Turn CRT effect on"}
          >
            {showCRT ? "CRT OFF" : "CRT ON"}
          </Button>
          {showCRT && (
            <Button
              variant="outline"
              size="icon"
              className="pixel-button"
              onClick={() => {
                setCrtIntensity((prev) => (prev === "low" ? "medium" : prev === "medium" ? "high" : "low"))
                setPlaySelectSound(true)
              }}
              aria-label={`CRT intensity: ${crtIntensity}`}
            >
              CRT {crtIntensity.toUpperCase()}
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="pixel-button"
            onClick={() => {
              setMuted(!muted)
              setPlaySelectSound(true)
            }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <Tabs defaultValue="game" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-black border-b border-purple-500 rounded-none h-12">
          <TabsTrigger
            value="game"
            className="tab-transition data-[state=active]:bg-purple-600 data-[state=active]:text-white pixel-text"
          >
            ADVENTURE MODE
          </TabsTrigger>
          <TabsTrigger
            value="showcase"
            className="tab-transition data-[state=active]:bg-purple-600 data-[state=active]:text-white pixel-text"
          >
            COLLECTION SHOWCASE
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="tab-transition data-[state=active]:bg-purple-600 data-[state=active]:text-white pixel-text"
          >
            COLLECTION STATS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="game" className="m-0 page-transition">
          {/* Game HUD */}
          <div className="bg-gradient-to-r from-black to-gray-900 px-4 py-2 flex justify-between items-center border-b-4 border-purple-600 shadow-md">
            <div className="flex gap-4 items-center">
              <div className="pixel-text text-purple-300">{getLevelName()}</div>
              <div className="pixel-text bg-gray-900 p-1 rounded text-yellow-400">SCORE: {score}</div>
            </div>
            <div className="pixel-text">
              LIVES:{" "}
              {Array(lives)
                .fill("♥")
                .map((heart, i) => (
                  <span key={i} className="text-red-500 animate-pulse-subtle inline-block mx-0.5">
                    {heart}
                  </span>
                ))}
            </div>
          </div>

          {/* Game Area */}
          <div className={cn("game-environment flex items-end overflow-hidden", getLevelBackground())}>
            {/* Parallax Layers */}
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=1000')] bg-repeat-x bg-bottom opacity-20 animate-[parallax-slow_60s_linear_infinite]"></div>
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=150&width=800')] bg-repeat-x bg-bottom opacity-30 animate-[parallax-medium_40s_linear_infinite]"></div>
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=500')] bg-repeat-x bg-bottom opacity-15 animate-[parallax-fast_25s_linear_infinite]"></div>

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]"></div>

            {/* Level info */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-4 py-1 rounded-md text-sm font-bold text-center">
              <div className="text-purple-300">
                LEVEL {currentLevel} • {getLevelName()}
              </div>
              {lastCollectedItem && (
                <div className="text-xs text-green-300 mt-1 animate-pulse">
                  COLLECTED: {getCollectibleById(lastCollectedItem)?.name}!
                </div>
              )}
            </div>

            {/* Platform */}
            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-r from-green-700 to-green-600 border-t-4 border-green-800 flex items-center">
              {/* Character */}
              <PixelCharacter position={characterPosition} isMoving={isMoving} />

              {/* Collectibles */}
              {collectibles.map((item) => (
                <CollectibleItem
                  key={item.id}
                  id={item.id}
                  position={item.position}
                  collected={collected.includes(item.id)}
                  onCollect={handleCollect}
                  rarity={item.rarity}
                />
              ))}

              {/* Seasonal Mascots */}
              {seasonalMascots.map((mascot, index) => (
                <SeasonalMascot
                  key={mascot.id}
                  id={mascot.id}
                  position={mascot.position}
                  collected={collected.includes(mascot.id)}
                  onCollect={handleCollect}
                  season={mascot.season}
                  color={mascot.color}
                  level={index + 1}
                  currentLevel={currentLevel}
                />
              ))}
            </div>

            {/* Level Navigation */}
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute left-2 top-1/2 transform -translate-y-1/2 pixel-button z-10",
                currentLevel === 1 && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => changeLevel(-1)}
              disabled={currentLevel === 1}
              aria-label="Previous level"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute right-2 top-1/2 transform -translate-y-1/2 pixel-button z-10",
                currentLevel === totalLevels && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => changeLevel(1)}
              disabled={currentLevel === totalLevels}
              aria-label="Next level"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Controls info */}
            <div className="absolute bottom-20 right-4 bg-black bg-opacity-70 p-2 rounded text-xs">
              <div className="mb-1 text-purple-300 font-bold">CONTROLS:</div>
              <div>← → : MOVE</div>
              <div>↑ SPACE : JUMP</div>
            </div>
          </div>

          {/* Scrolling Marquee */}
          <ScrollingMarquee speed="normal" pauseOnHover={true} />
        </TabsContent>

        <TabsContent value="showcase" className="m-0 p-4 page-transition">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <h2 className="pixel-text text-xl text-purple-400 bg-black bg-opacity-50 p-2">
                DIGITAL COLLECTIBLES SHOWCASE
              </h2>

              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collectibles..."
                    className="pl-8 bg-black border-purple-500 hover-transition focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search collectibles"
                  />
                </div>

                <div className="flex gap-1 flex-wrap">
                  {["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"].map((rarity) => (
                    <Badge
                      key={rarity}
                      className={cn(
                        "cursor-pointer hover-transition",
                        activeRarity === rarity
                          ? rarityColors[rarity as keyof typeof rarityColors]
                          : "bg-gray-800 hover:bg-gray-700",
                      )}
                      onClick={() => {
                        setActiveRarity(activeRarity === rarity ? null : rarity)
                        setPlaySelectSound(true)
                      }}
                    >
                      {rarity}
                    </Badge>
                  ))}
                  {activeRarity && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-800 hover-transition"
                      onClick={() => {
                        setActiveRarity(null)
                        setPlaySelectSound(true)
                      }}
                    >
                      CLEAR
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {selectedCollectible ? (
              <div className="mt-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <Button
                  variant="outline"
                  className="mb-4 pixel-button"
                  onClick={() => {
                    setSelectedCollectible(null)
                    setPlaySelectSound(true)
                  }}
                >
                  ← BACK TO COLLECTION
                </Button>
                <CollectibleDetail
                  collectible={getCollectibleById(selectedCollectible)!}
                  collected={collected.includes(selectedCollectible)}
                  onCollect={handleCollect}
                />
              </div>
            ) : (
              <div className="card-grid mt-4 animate-in fade-in duration-300">
                {filteredCollectibles.length > 0 ? (
                  filteredCollectibles.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "pixel-card cursor-pointer",
                        rarityColors[item.rarity as keyof typeof rarityColors],
                        collected.includes(item.id) ? "opacity-100" : "opacity-70",
                      )}
                      onClick={() => {
                        setSelectedCollectible(item.id)
                        setPlaySelectSound(true)
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-xs tracking-wider truncate max-w-[70%]">{item.name}</div>
                        <Badge
                          className={cn(
                            "text-[10px] px-1 py-0 rarity-badge",
                            rarityColors[item.rarity as keyof typeof rarityColors],
                          )}
                        >
                          {item.rarity}
                        </Badge>
                      </div>

                      <div className="collectible-image h-32 relative overflow-hidden group">
                        <div className="grid-bg"></div>

                        {item.category === "MASCOTS" ? (
                          <div
                            className={cn(
                              "absolute inset-0 flex items-center justify-center",
                              item.color === "green"
                                ? "bg-green-400"
                                : item.color === "teal"
                                  ? "bg-teal-400"
                                  : item.color === "orange"
                                    ? "bg-orange-400"
                                    : "bg-blue-400",
                              "transition-transform duration-300 group-hover:scale-110",
                            )}
                          >
                            <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[24px] border-transparent border-b-black"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3">
                              <div className="flex gap-4">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                              </div>
                              <div className="mt-2 w-6 h-2 border-b-2 border-black rounded-full"></div>
                            </div>
                          </div>
                        ) : item.category === "ITEMS" ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {item.id === "pixel-sword" ? (
                              <div className="w-6 h-16 bg-gray-300 relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-yellow-500"></div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-yellow-800"></div>
                              </div>
                            ) : item.id === "mana-potion" ? (
                              <div className="w-8 h-10 bg-blue-400 rounded-t-full relative transition-transform duration-300 group-hover:scale-110">
                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-blue-200"></div>
                                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-blue-600"></div>
                                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-blue-600"></div>
                              </div>
                            ) : item.id === "golden-key" ? (
                              <div className="w-12 h-8 bg-yellow-500 relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-4 bg-yellow-500 border-2 border-black rounded-full"></div>
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-4 bg-yellow-700"></div>
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-400 rotate-45 transition-transform duration-300 group-hover:scale-110"></div>
                            )}
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-full relative transition-transform duration-300 group-hover:scale-110",
                                item.color === "orange"
                                  ? "bg-orange-400"
                                  : item.color === "yellow"
                                    ? "bg-yellow-400"
                                    : item.color === "purple"
                                      ? "bg-purple-400"
                                      : "bg-green-400",
                              )}
                            >
                              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-black rounded-full"></div>
                              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-black rounded-full"></div>
                              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-6 h-2 border-b-2 border-black rounded-full"></div>
                            </div>
                          </div>
                        )}

                        {!collected.includes(item.id) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 group-hover:bg-opacity-40">
                            <div className="text-white text-xs bg-purple-900 bg-opacity-70 px-2 py-1 rounded animate-pulse">
                              LOCKED
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-2 text-[10px]">
                        <div className="bg-black bg-opacity-50 px-1 rounded">{item.type}</div>
                        <div className="font-mono">#{String(Math.floor(Math.random() * 1000)).padStart(3, "0")}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    No collectibles match your search criteria. Try adjusting your filters.
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="m-0 p-4 page-transition">
          <div className="flex flex-col gap-6">
            <h2 className="pixel-text text-xl text-purple-400 bg-black bg-opacity-50 p-2">COLLECTION STATISTICS</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-purple-500 p-4 bg-black bg-opacity-80 rounded-sm shadow-lg hover:shadow-purple-900 transition-all duration-300">
                <h3 className="text-lg font-bold mb-4 text-purple-300">Collection Progress</h3>
                <div className="w-full bg-gray-800 h-4 mb-2 rounded-sm overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-4 transition-all duration-1000 ease-out"
                    style={{ width: `${(collected.length / allCollectibles.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm">
                  <span className="font-bold">{collected.length}</span> / {allCollectibles.length} collected (
                  <span className="text-purple-300">
                    {Math.round((collected.length / allCollectibles.length) * 100)}%
                  </span>
                  )
                </div>
              </div>

              <div className="border-2 border-purple-500 p-4 bg-black bg-opacity-80 rounded-sm shadow-lg hover:shadow-purple-900 transition-all duration-300">
                <h3 className="text-lg font-bold mb-4 text-purple-300">Rarity Breakdown</h3>
                <div className="space-y-2">
                  {raritiesTotalCounts.map(([rarity, count]) => {
                    const collected = rarityCollectedCounts.find((item) => item[0] === rarity)?.[1] || 0
                    return (
                      <div key={rarity} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3", rarityColors[rarity as keyof typeof rarityColors])}></div>
                        <div className="text-sm flex-1">{rarity}</div>
                        <div className="text-sm">
                          <span className="font-bold">{collected}</span> / {count}
                        </div>
                        <div className="w-16 bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full", rarityColors[rarity as keyof typeof rarityColors])}
                            style={{ width: `${(collected / count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="border-2 border-purple-500 p-4 bg-black bg-opacity-80 rounded-sm shadow-lg hover:shadow-purple-900 transition-all duration-300">
                <h3 className="text-lg font-bold mb-4 text-purple-300">Category Breakdown</h3>
                <div className="space-y-2">
                  {categoryTotalCounts.map(([category, count]) => {
                    const collected = categoryCollectedCounts.find((item) => item[0] === category)?.[1] || 0
                    return (
                      <div key={category} className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-3 h-3",
                            category === "ITEMS"
                              ? "bg-red-500"
                              : category === "MASCOTS"
                                ? "bg-green-500"
                                : "bg-blue-500",
                          )}
                        ></div>
                        <div className="text-sm flex-1">{category}</div>
                        <div className="text-sm">
                          <span className="font-bold">{collected}</span> / {count}
                        </div>
                        <div className="w-16 bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full",
                              category === "ITEMS"
                                ? "bg-red-500"
                                : category === "MASCOTS"
                                  ? "bg-green-500"
                                  : "bg-blue-500",
                            )}
                            style={{ width: `${(collected / count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="border-2 border-purple-500 p-4 bg-black bg-opacity-80 rounded-sm shadow-lg hover:shadow-purple-900 transition-all duration-300">
              <h3 className="text-lg font-bold mb-4 text-purple-300">Recent Acquisitions</h3>
              {collected.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {collected
                    .slice(-6)
                    .reverse()
                    .map((id) => {
                      const item = getCollectibleById(id)
                      return item ? (
                        <div
                          key={id}
                          className={cn(
                            "border-2 p-2 cursor-pointer transition-all duration-200 hover:scale-105",
                            rarityColors[item.rarity as keyof typeof rarityColors],
                          )}
                          onClick={() => {
                            setSelectedCollectible(id)
                            setActiveTab("showcase")
                            setPlaySelectSound(true)
                          }}
                        >
                          <div className="text-xs font-bold truncate">{item.name}</div>
                          <div className="text-[10px] text-gray-300">{item.type}</div>
                          <div className="mt-1 text-[8px] opacity-70">{new Date().toLocaleDateString()}</div>
                        </div>
                      ) : null
                    })}
                </div>
              ) : (
                <div className="text-gray-500 py-4 text-center">
                  No collectibles acquired yet. Start your adventure!
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Dialog */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="bg-black border-4 border-purple-600 text-white">
          <DialogHeader>
            <DialogTitle className="pixel-title text-xl text-purple-400">PIXELMON COLLECT GUIDE</DialogTitle>
            <DialogDescription className="text-white">
              <div className="space-y-4 mt-4">
                <p>
                  Welcome to <span className="text-purple-400 font-bold">PIXELMON COLLECT</span>, the ultimate digital
                  collectibles showcase! Explore different realms to discover and collect pixel treasures.
                </p>
                <p>
                  Use <span className="text-purple-400 font-bold">LEFT/RIGHT ARROW KEYS</span> to move your character in
                  Adventure Mode. Press <span className="text-purple-400 font-bold">UP ARROW or SPACE</span> to jump.
                </p>
                <p>Collect items by touching them with your character or clicking on them in the showcase.</p>
                <p>
                  Find all <span className="text-green-400 font-bold">SEASONAL MASCOTS</span> and{" "}
                  <span className="text-blue-400 font-bold">RARE ITEMS</span> to complete your collection!
                </p>
                <div className="mt-6 p-3 bg-purple-900 bg-opacity-30 rounded-sm">
                  <p className="text-sm text-center text-purple-300 font-bold">COLLECT • TRADE • SHOWCASE</p>
                  <p className="text-xs text-center text-green-300 mt-1">DIGITAL COLLECTIBLES SINCE 2025</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Sound effects */}
      <SoundEffect play={playCollectSound} type="collect" onComplete={() => setPlayCollectSound(false)} />
      <SoundEffect play={playMoveSound} type="move" onComplete={() => setPlayMoveSound(false)} volume={0.1} />
      <SoundEffect play={playSelectSound} type="select" onComplete={() => setPlaySelectSound(false)} />
    </main>
  )
}
