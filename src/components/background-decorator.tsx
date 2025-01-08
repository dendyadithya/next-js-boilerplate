'use client'

import { motion } from 'motion/react'

export default function BackgroundDecorator() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {/* Top Section */}
        <div className="absolute left-[5%] top-[2%] h-40 w-2 -rotate-[25deg] bg-primary/5" />
        <div className="bg-primary/4 absolute left-[12%] top-[8%] h-24 w-1.5 rotate-[40deg]" />
        <div className="bg-primary/3 absolute left-[20%] top-[5%] h-32 w-1 -rotate-[15deg]" />
        <div className="bg-primary/6 absolute left-[28%] top-[12%] h-48 w-2 rotate-[35deg]" />
        <div className="bg-primary/4 absolute right-[25%] top-[3%] h-36 w-1.5 -rotate-[30deg]" />
        <div className="absolute right-[15%] top-[10%] h-44 w-2 rotate-[20deg] bg-primary/5" />
        <div className="bg-primary/3 absolute right-[8%] top-[15%] h-28 w-1 -rotate-[45deg]" />

        {/* Upper Middle Section */}
        <div className="bg-primary/4 absolute left-[10%] top-[25%] h-52 w-2 rotate-[15deg]" />
        <div className="absolute left-[22%] top-[30%] h-36 w-1.5 -rotate-[35deg] bg-primary/5" />
        <div className="bg-primary/3 absolute left-[35%] top-[28%] h-44 w-2 rotate-[25deg]" />
        <div className="bg-primary/6 absolute right-[30%] top-[22%] h-48 w-1.5 -rotate-[20deg]" />
        <div className="bg-primary/4 absolute right-[18%] top-[32%] h-40 w-2 rotate-[40deg]" />

        {/* Middle Section */}
        <div className="absolute left-[15%] top-[45%] h-48 w-2 -rotate-[30deg] bg-primary/5" />
        <div className="bg-primary/4 absolute left-[28%] top-[48%] h-36 w-1.5 rotate-[25deg]" />
        <div className="bg-primary/3 absolute left-[40%] top-[42%] h-44 w-2 -rotate-[15deg]" />
        <div className="absolute right-[35%] top-[46%] h-52 w-1.5 rotate-[35deg] bg-primary/5" />
        <div className="bg-primary/4 absolute right-[22%] top-[40%] h-40 w-2 -rotate-[40deg]" />

        {/* Lower Middle Section */}
        <div className="bg-primary/6 absolute left-[8%] top-[65%] h-44 w-2 rotate-[20deg]" />
        <div className="bg-primary/4 absolute left-[25%] top-[62%] h-36 w-1.5 -rotate-[25deg]" />
        <div className="bg-primary/3 absolute left-[38%] top-[68%] h-48 w-2 rotate-[35deg]" />
        <div className="absolute right-[28%] top-[64%] h-40 w-1.5 -rotate-[30deg] bg-primary/5" />
        <div className="bg-primary/4 absolute right-[15%] top-[66%] h-52 w-2 rotate-[15deg]" />

        {/* Bottom Section */}
        <div className="absolute left-[12%] top-[82%] h-40 w-2 -rotate-[35deg] bg-primary/5" />
        <div className="bg-primary/4 absolute left-[30%] top-[85%] h-48 w-1.5 rotate-[25deg]" />
        <div className="bg-primary/3 absolute left-[45%] top-[80%] h-36 w-2 -rotate-[20deg]" />
        <div className="bg-primary/6 absolute right-[32%] top-[83%] h-44 w-1.5 rotate-[40deg]" />
        <div className="bg-primary/4 absolute right-[20%] top-[88%] h-52 w-2 -rotate-[15deg]" />

        {/* Center Accents */}
        <div className="absolute left-[48%] top-[15%] h-56 w-2 rotate-[30deg] bg-primary/5" />
        <div className="bg-primary/4 absolute left-[52%] top-[35%] h-48 w-1.5 -rotate-[25deg]" />
        <div className="bg-primary/3 absolute right-[45%] top-[55%] h-52 w-2 rotate-[20deg]" />
        <div className="absolute right-[55%] top-[75%] h-44 w-1.5 -rotate-[35deg] bg-primary/5" />
      </motion.div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
    </div>
  )
}
