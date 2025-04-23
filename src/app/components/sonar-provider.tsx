"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { Radio, Users, GitPullRequest, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type SonarType = "song" | "vote" | "version" | "info"

export interface SonarPing {
  id: string
  type: SonarType
  title?: string
  message: string
  detail?: string
  duration?: number
  createdAt: number
  visible: boolean
}

interface SonarContextType {
  pings: SonarPing[]
  sendPing: (ping: Omit<SonarPing, "id" | "createdAt" | "visible">) => void
  clearPings: () => void
  dismissPing: (id: string) => void
}

const SonarContext = createContext<SonarContextType | undefined>(undefined)

const MAX_VISIBLE_PINGS = 4

export function SonarProvider({ children }: { children: ReactNode }) {
  const [pings, setPings] = useState<SonarPing[]>([])
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const sendPing = (ping: Omit<SonarPing, "id" | "createdAt" | "visible">) => {
    const newPing = {
      ...ping,
      id: Math.random().toString(36).substring(2, 9),
      duration: ping.duration || 5000,
      createdAt: Date.now(),
      visible: true,
    }

    setPings((prev) => {
      // Keep only the most recent MAX_VISIBLE_PINGS pings plus the new one
      const updatedPings = [...prev, newPing]
      if (updatedPings.length > MAX_VISIBLE_PINGS) {
        // Remove the oldest pings that exceed our limit
        const excessPings = updatedPings.length - MAX_VISIBLE_PINGS
        const oldestPings = [...updatedPings].sort((a, b) => a.createdAt - b.createdAt).slice(0, excessPings)

        // Clear timeouts for pings we're removing
        oldestPings.forEach((ping) => {
          if (timeoutsRef.current.has(ping.id)) {
            clearTimeout(timeoutsRef.current.get(ping.id)!)
            timeoutsRef.current.delete(ping.id)
          }
        })

        // Filter out the oldest pings
        return updatedPings.filter((p) => !oldestPings.some((old) => old.id === p.id))
      }
      return updatedPings
    })

    // Set timeout to hide this ping after its duration
    const timeout = setTimeout(() => {
      dismissPing(newPing.id)
    }, newPing.duration)

    timeoutsRef.current.set(newPing.id, timeout)
  }

  const dismissPing = (id: string) => {
    // First set the ping to invisible to trigger animation
    setPings((prev) => prev.map((ping) => (ping.id === id ? { ...ping, visible: false } : ping)))

    // Then remove it after animation completes
    setTimeout(() => {
      setPings((prev) => prev.filter((ping) => ping.id !== id))
    }, 500)

    // Clear the timeout
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id)!)
      timeoutsRef.current.delete(id)
    }
  }

  const clearPings = () => {
    // Clear all timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current.clear()

    // Set all pings to invisible first
    setPings((prev) => prev.map((ping) => ({ ...ping, visible: false })))

    // Then remove them after animation
    setTimeout(() => {
      setPings([])
    }, 500)
  }

  useEffect(() => {
    return () => {
      // Clean up timeouts on unmount
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current.clear()
      // Clear all pings immediately on unmount
      setPings([])
    }
  }, [])

  const getIcon = (type: SonarType) => {
    switch (type) {
      case "song":
        return <Radio className="h-5 w-5 text-primary" />
      case "vote":
        return <Users className="h-5 w-5 text-primary" />
      case "version":
        return <GitPullRequest className="h-5 w-5 text-primary" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-primary" />
    }
  }

  const getHighlightText = (type: SonarType) => {
    switch (type) {
      case "song":
        return "NOW PLAYING"
      case "vote":
        return "NEW VOTES"
      case "version":
        return "UPDATE"
      case "info":
      default:
        return "NOTICE"
    }
  }

  return (
    <SonarContext.Provider value={{ pings, sendPing, clearPings, dismissPing }}>
      {/* Sonar ping container - stacks from bottom right */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col-reverse gap-2 max-h-[70vh] overflow-hidden pointer-events-none">
        {pings.map((ping) => (
          <div
            key={ping.id}
            className={cn(
              "fixed font-outfit bottom-36 right-16 max-w-md bg-white opacity-80 backdrop-blur-sm text-black rounded-lg shadow-xl border border-primary/20 transition-all duration-500 z-50 overflow-hidden",
              ping.visible ? "translate-y-0 opacity-80" : "translate-y-10 opacity-0",
            )}
            style={{
              transitionDelay: ping.visible ? "0ms" : "0ms",
            }}
          >
            <div className="px-4 py-3 pr-10 relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => dismissPing(ping.id)}
              >
                <X className="h-3 w-3" />
              </Button>

              <div className="flex items-center gap-3">
                {getIcon(ping.type)}
                <div className="flex flex-col">
                  <span className="text-sm font-medium tracking-wide flex items-center flex-wrap">
                    <span className="text-highlight mr-2">{getHighlightText(ping.type)}</span>
                    {ping.title && <span className="text-primary">{ping.title}</span>}
                  </span>
                  <span className="text-sm">{ping.message}</span>
                  {ping.detail && <span className="text-xs opacity-60 mt-0.5">{ping.detail}</span>}
                </div>
              </div>
            </div>
            <div className="h-1 bg-primary/20 w-full">
              <div
                className="h-1 bg-primary"
                style={{
                  animation: `shrink ${ping.duration}ms linear forwards`,
                  animationPlayState: ping.visible ? "running" : "paused",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {children}
    </SonarContext.Provider>
  )
}

export function useSonar() {
  const context = useContext(SonarContext)
  if (context === undefined) {
    throw new Error("useSonar must be used within a SonarProvider")
  }
  return context
}

