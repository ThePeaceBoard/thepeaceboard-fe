"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "group relative inline-flex w-10 h-[4.5rem] shrink-0 cursor-pointer rounded-full transition-all duration-300",
      "bg-white/5 hover:bg-white/10",
      "data-[state=checked]:bg-highlight/10 data-[state=checked]:hover:bg-highlight/20",
      "backdrop-blur-sm border border-white/10",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-10 w-10 rounded-full",
        "shadow-lg ring-0 transition-all duration-300",
        "group-hover:scale-110",
        "data-[state=checked]:translate-y-[2.07rem]",
        "bg-white/50 group-hover:bg-white/60",
        "data-[state=checked]:bg-highlight data-[state=checked]:group-hover:bg-highlight/90",
        "after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0",
        "after:rounded-full after:shadow-[0_0_8px_rgba(255,255,255,0.1)]",
        "data-[state=checked]:after:shadow-[0_0_8px_rgba(226,138,75,0.3)]"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch } 