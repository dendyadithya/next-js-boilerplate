'use client'

import { motion } from 'motion/react'
import { GridPatternSvg } from './patterns/grid-pattern'
import { NoisePatternSvg } from './patterns/noise-pattern'

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-gradient-to-r from-primary/30 to-primary/5 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
        className="absolute -right-[15%] top-[40%] h-[500px] w-[500px] rounded-full bg-gradient-to-l from-blue-500/20 to-purple-500/20 blur-3xl"
      />

      {/* Mesh Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      {/* Grid Pattern */}
      <GridPatternSvg />

      {/* Noise Pattern */}
      <NoisePatternSvg />
    </div>
  )
}

// Alternatif versi minimal
export function MinimalAnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Subtle gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />

      {/* Animated lines */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[2px] w-[100px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            animate={{
              x: ['0%', '100%'],
              y: [i * 30 + '%', i * 30 + '%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,rgba(0,0,0,0.1)_1px,transparent_0)] [background-size:20px_20px] dark:bg-[radial-gradient(circle_1px_at_center,rgba(255,255,255,0.1)_1px,transparent_0)]" />
    </div>
  )
}
