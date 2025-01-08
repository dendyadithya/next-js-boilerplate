'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface TextWithOverflowTooltipProps {
  text: string
  className?: string
  isActive?: boolean
}

export default function TextWithOverflowTooltip({ text, className, isActive }: TextWithOverflowTooltipProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth
        setHasOverflow(isOverflowing)
      }
    }

    // Initial check
    checkOverflow()

    // Setup ResizeObserver
    const observer = new ResizeObserver(() => {
      setTimeout(checkOverflow, 0) // Add small delay to ensure DOM is updated
    })

    if (textRef.current) {
      observer.observe(textRef.current)
    }

    // Cleanup
    return () => observer.disconnect()
  }, [text])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            ref={textRef}
            className={cn(
              'block max-w-full truncate', // Ensure max-width is set
              className
            )}
            style={{ width: '100%' }} // Force width to be 100%
          >
            {text}
          </span>
        </TooltipTrigger>
        {hasOverflow && (
          <TooltipContent
            side="right"
            sideOffset={12}
            className="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          >
            <div className="flex items-center gap-2">
              <div className={cn('size-2 rounded-full', isActive ? 'bg-primary' : 'bg-muted-foreground/30')} />
              <span className="font-medium">{text}</span>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
