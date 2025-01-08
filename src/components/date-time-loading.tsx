import { motion } from 'motion/react'

export default function DateTimeLoading() {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className="h-7 w-[140px] rounded bg-gray-200"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="h-5 w-[180px] rounded bg-gray-200"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
          delay: 0.2
        }}
      />
    </div>
  )
}
