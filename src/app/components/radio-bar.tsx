"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Snail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useSonar } from "./sonar-provider"
interface Song {
  title: string
  artist: string
  duration: number
}

export default function RadioPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(70)
  const [currentSong, setCurrentSong] = useState<Song>({
    title: "Slow Groove",
    artist: "Shell Beats",
    duration: 180,
  })
  const [progress, setProgress] = useState(0)
  const { sendPing } = useSonar()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  const songs: Song[] = [
    { title: "Slow Groove", artist: "Shell Beats", duration: 180 },
    { title: "Garden Path", artist: "Slime Trails", duration: 210 },
    { title: "Silver Trails", artist: "The Gastropods", duration: 195 },
    { title: "Moonlight Crawl", artist: "Shell Shock", duration: 225 },
    { title: "Lettuce Dreams", artist: "Spiral House", duration: 165 },
  ]

  useEffect(() => {
    // Simulate changing songs
    const songInterval = setInterval(() => {
      const randomSong = songs[Math.floor(Math.random() * songs.length)]
      setCurrentSong(randomSong)
      setProgress(0)

      // Show song notification
      sendPing({
        type: "song",
        title: randomSong.title,
        message: randomSong.artist,
        duration: 5000,
      })
    }, 15000)

    sendPing({
      type: "song",
      title: currentSong.title,
      message: currentSong.artist,
      duration: 5000,
    })

    setTimeout(() => {
      sendPing({
        type: "vote",
        message: "10 new people voted for peace",
        detail: "Total: 1,245",
        duration: 4000,
      })
    }, 7000)

    setTimeout(() => {
      sendPing({
        type: "version",
        message: "Version 2.3 is now available",
        detail: "Click to update",
        duration: 4000,
      })
    }, 20000)

    return () => {
      clearInterval(songInterval)
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + (100 / currentSong.duration) * 0.5
        })
      }, 500)
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, currentSong])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          
        })
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  return (
    <div className="relative z-50">
      <div
        className={cn(
          "flex items-center transition-all duration-300 ease-in-out rounded-lg bg-secondary/95 backdrop-blur-sm shadow-xl border border-primary/20 relative opacity-90 overflow-hidden hover:opacity-100",
          isExpanded ? "w-[22rem]" : "w-14 h-14",
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-14 w-14 rounded-sm flex items-center justify-center hover:bg-primary/10 transition-all duration-300",
            isExpanded ? "rounded-r-none" : "",
          )}
          onClick={togglePlay}
        >
          <Snail className="h-6 w-6 text-primary" />
        </Button>

        {/* Expanded content */}
        <div
          className={cn(
            "flex flex-col h-14 transition-all duration-300 overflow-hidden",
            isExpanded ? "w-80 opacity-100" : "w-0 opacity-0",
          )}
        >
          <div className="flex items-center justify-between px-3 h-full">
            <div className="flex flex-col justify-center overflow-hidden mr-2">
              <p className="text-sm font-medium text-black truncate">{currentSong.title}</p>
              <p className="text-xs text-black/80 truncate">{currentSong.artist}</p>
              <div className="w-full bg-primary/20 h-1 rounded-full mt-1.5">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10 text-primary"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10 text-primary"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "absolute bottom-2 left-14 right-4 transition-all duration-300",
            isExpanded ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <Slider value={[volume]} min={0} max={100} step={1} onValueChange={handleVolumeChange} className="h-1.5" />
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src="/placeholder-audio.mp3" loop preload="auto" />
    </div>
  )
}

