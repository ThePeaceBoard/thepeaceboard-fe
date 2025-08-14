"use client"

import { useRouter } from "next/navigation"
import { ChevronRight, Eye, Flag } from "lucide-react"
import { PeaceSign } from "@/components/peace-sign"
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

// Define the props interface
interface PeaceBannerProps {
  signedCount: number
  countriesCount: number
  watchingCount: number
  onNavigateToDashboard?: () => void
}

// Create a counter component for animated numbers
function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const [prevValue, setPrevValue] = useState(value)
  const springValue = useSpring(prevValue, { stiffness: 100, damping: 30 })
  const displayValue = useMotionValue(prevValue)
  const rounded = useTransform(displayValue, (latest) => Math.round(latest).toLocaleString())

  useEffect(() => {
    if (prevValue !== value) {
      // Animate from previous to new value
      springValue.set(value)
      setPrevValue(value)

      const unsubscribe = springValue.onChange((latest) => {
        displayValue.set(latest)
      })

      return unsubscribe
    }
  }, [value, prevValue, springValue, displayValue])

  return <motion.span className={className}>{rounded}</motion.span>
}

export default function StatsBar({
  signedCount = 100000,
  countriesCount = 24,
  watchingCount = 10,
  onNavigateToDashboard,
}: PeaceBannerProps) {
  const router = useRouter()

  const navigateToDashboard = () => {
    if (onNavigateToDashboard) {
      onNavigateToDashboard()
    } else {
      router.push("/dashboard")
    }
  }

  const statVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  return (
    <div className="w-full bg-transparent align-bottom text-white px-2 sm:px-4 md:px-12 overflow-hidden font-bebas">
      <motion.div
        className="max-w-7xl mx-auto gap-4 sm:gap-6 lg:gap-8 flex flex-col sm:flex-row items-end justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        <motion.div
          className="flex items-end gap-2 sm:gap-3 group cursor-pointer"
          variants={statVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <span className="text-amber-300 flex items-end pb-1 filter blur-[1px] group-hover:blur-0 transition-all duration-200 transform group-hover:rotate-12">
            <PeaceSign className="w-6 h-6 sm:w-8 sm:h-8" />
          </span>
          <div className="flex flex-col md:flex-row items-end gap-1 md:gap-3" >
            <AnimatedCounter
              value={signedCount}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider group-hover:text-amber-200 transition-colors leading-tight"
            />
            <div className="flex flex-col text-left text-xs sm:text-sm md:text-base uppercase tracking-wider pb-1 leading-none text-gray-100">
              <span>people</span>
              <span>signed for peace</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-end gap-2 sm:gap-3 group cursor-pointer"
          variants={statVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <span className="text-amber-300 flex items-end pb-1 filter blur-[1px] group-hover:blur-0 transition-all duration-200 transform group-hover:rotate-12">
            <Flag className="w-6 h-6 sm:w-8 sm:h-8" />
          </span>
          <div className="flex flex-col md:flex-row items-end gap-1 md:gap-3">
            <AnimatedCounter
              value={countriesCount}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider group-hover:text-amber-200 transition-colors leading-tight"
            />
            <div className="flex flex-col text-left text-xs sm:text-sm md:text-base uppercase tracking-wider pb-1 text-gray-100">
              <span>countries</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-end gap-2 sm:gap-3 group cursor-pointer"
          variants={statVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <span className="text-amber-300 flex items-end pb-1 filter blur-[1px] group-hover:blur-0 transition-all duration-200 transform group-hover:rotate-12">
            <Eye className="w-6 h-6 sm:w-8 sm:h-8" />
          </span>
          <div className="flex flex-col md:flex-row items-end gap-1 md:gap-3">
            <AnimatedCounter
              value={watchingCount}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider group-hover:text-amber-200 transition-colors leading-tight"
            />
            <div className="flex flex-col text-left text-xs sm:text-sm md:text-base uppercase tracking-wider pb-1 leading-none text-gray-100">
              <span>actively</span>
              <span>watching</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-end justify-end cursor-pointer self-end"
          onClick={navigateToDashboard}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-amber-300 text-[#1e2649] p-1.5 sm:p-2 rounded-full hover:bg-amber-200 transition-colors">
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

