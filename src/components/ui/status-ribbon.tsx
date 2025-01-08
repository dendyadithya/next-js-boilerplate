'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { VariantProps, cva } from 'class-variance-authority'

const ribbonVariants = cva(['flex items-center gap-1.5 rounded-r-full px-3 py-1', 'font-medium text-white shadow-md'], {
  variants: {
    variant: {
      success: [
        'bg-gradient-to-r from-emerald-400/90 to-emerald-500/90',
        '[&_.dot]:bg-emerald-200 [&_.tail]:bg-emerald-500/90 [&_.shadow]:bg-emerald-700/80'
      ],
      warning: [
        'bg-gradient-to-r from-amber-400/90 to-amber-500/90',
        '[&_.dot]:bg-amber-200 [&_.tail]:bg-amber-500/90 [&_.shadow]:bg-amber-700/80'
      ],
      info: [
        'bg-gradient-to-r from-blue-400/90 to-blue-500/90',
        '[&_.dot]:bg-blue-200 [&_.tail]:bg-blue-500/90 [&_.shadow]:bg-blue-700/80'
      ],
      error: [
        'bg-gradient-to-r from-red-400/90 to-red-500/90',
        '[&_.dot]:bg-red-200 [&_.tail]:bg-red-500/90 [&_.shadow]:bg-red-700/80'
      ],
      checking: [
        'bg-gradient-to-r from-sky-400/90 to-sky-500/90',
        '[&_.dot]:bg-sky-200 [&_.tail]:bg-sky-500/90 [&_.shadow]:bg-sky-700/80'
      ]
    },
    size: {
      sm: 'text-xs py-0.5 px-2',
      md: 'text-sm py-1 px-3',
      lg: 'text-base py-1.5 px-4'
    }
  },
  defaultVariants: {
    variant: 'info',
    size: 'md'
  }
})

interface StatusRibbonProps extends VariantProps<typeof ribbonVariants> {
  label: string
  className?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  showDot?: boolean
}

const positionClasses = {
  'bottom-left': '-bottom-3 left-6',
  'bottom-right': '-bottom-3 right-6',
  'top-left': '-top-3 left-6',
  'top-right': '-top-3 right-6'
} as const

const variantStyles = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  error: 'bg-red-500',
  checking: 'bg-sky-500'
} as const

export default function StatusRibbon({
  label,
  variant,
  size,
  position = 'bottom-left',
  showDot = true,
  className
}: StatusRibbonProps) {
  return (
    <div className={cn('absolute', positionClasses[position], className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative"
      >
        {/* Left Tail */}
        <div
          className={cn('absolute -left-2 bottom-0 h-2 w-2', variantStyles[variant as keyof typeof variantStyles])}
          style={{
            clipPath: 'polygon(0 0, 100% 100%, 100% 0)'
          }}
        />

        {/* Ribbon */}
        <div className={ribbonVariants({ variant, size })}>
          {showDot && <div className="dot h-2 w-2 rounded-full" />}
          <span>{label}</span>
        </div>
      </motion.div>
    </div>
  )
}
