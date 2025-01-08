'use client'

import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface StatusAlertProps {
  isOpen: boolean
  onClose: () => void
  status?: 'loading' | 'success' | 'error'
  title?: string
  description?: string
  onSuccessComplete?: () => void
  buttonText?: string
  onButtonClick?: () => void
}

export default function StatusAlert({
  isOpen,
  onClose,
  status = 'loading',
  title,
  description,
  onSuccessComplete,
  buttonText,
  onButtonClick
}: StatusAlertProps) {
  useEffect(() => {
    if (isOpen && status === 'success') {
      const timer = setTimeout(() => {
        onSuccessComplete?.()
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, status, onClose, onSuccessComplete])

  const defaultTitle = {
    loading: 'Sedang Memproses',
    success: 'Berhasil',
    error: 'Gagal'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'relative w-[400px] overflow-hidden rounded-2xl bg-white/95 p-6',
                'border border-gray-100/50',
                'shadow-[0_8px_30px_rgb(0,0,0,0.06)]',
                'dark:border-gray-800/50 dark:bg-gray-900/95'
              )}
            >
              {/* Enhanced Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Primary Gradient */}
                <div
                  className={cn(
                    'absolute inset-0',
                    status === 'success' && [
                      'bg-gradient-to-br from-green-50 via-white to-green-50/50',
                      'dark:from-green-950/20 dark:via-transparent dark:to-green-950/20'
                    ],
                    status === 'loading' && [
                      'bg-gradient-to-br from-blue-50 via-white to-blue-50/50',
                      'dark:from-blue-950/20 dark:via-transparent dark:to-blue-950/20'
                    ],
                    status === 'error' && [
                      'bg-gradient-to-br from-red-50 via-white to-red-50/50',
                      'dark:from-red-950/20 dark:via-transparent dark:to-red-950/20'
                    ]
                  )}
                />

                {/* Animated Waves */}
                <div className="absolute inset-0">
                  <motion.div
                    className={cn(
                      'absolute inset-0 opacity-[0.15]',
                      status === 'success' && 'bg-green-200 dark:bg-green-800',
                      status === 'loading' && 'bg-blue-200 dark:bg-blue-800',
                      status === 'error' && 'bg-red-200 dark:bg-red-800'
                    )}
                    style={{
                      maskImage: 'radial-gradient(circle at center, transparent 40%, black)',
                      WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black)'
                    }}
                  >
                    <motion.div
                      className="h-full w-full"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%']
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear'
                      }}
                      style={{
                        backgroundImage: `
                          repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 20px,
                            rgba(0, 0, 0, 0.1) 20px,
                            rgba(0, 0, 0, 0.1) 40px
                          )
                        `,
                        backgroundSize: '200% 200%'
                      }}
                    />
                  </motion.div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute inset-0">
                  <div
                    className={cn(
                      'absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.15]',
                      'blur-3xl transition-all duration-500',
                      status === 'success' && 'bg-green-200 dark:bg-green-800',
                      status === 'loading' && 'bg-blue-200 dark:bg-blue-800',
                      status === 'error' && 'bg-red-200 dark:bg-red-800'
                    )}
                  />
                  <div
                    className={cn(
                      'absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-[0.15]',
                      'blur-3xl transition-all duration-500',
                      status === 'success' && 'bg-green-200 dark:bg-green-800',
                      status === 'loading' && 'bg-blue-200 dark:bg-blue-800',
                      status === 'error' && 'bg-red-200 dark:bg-red-800'
                    )}
                  />
                </div>
              </div>

              {/* Content Container */}
              <div className="relative">
                <div className="flex flex-col items-center gap-5">
                  {/* Icon Container dengan animasi subtle */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      'relative flex h-16 w-16 items-center justify-center rounded-full',
                      status === 'success' && 'bg-green-50 dark:bg-green-950/30',
                      status === 'loading' && 'bg-blue-50 dark:bg-blue-950/30',
                      status === 'error' && 'bg-red-50 dark:bg-red-950/30'
                    )}
                  >
                    {/* Glow effect */}
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full opacity-40 blur-md',
                        status === 'success' && 'bg-green-200',
                        status === 'loading' && 'bg-blue-200',
                        status === 'error' && 'bg-red-200'
                      )}
                    />

                    {/* Icon */}
                    <div className="relative">
                      {status === 'loading' && <LoadingAlert />}
                      {status === 'success' && <SuccessAlert />}
                      {status === 'error' && <ErrorAlert />}
                    </div>
                  </motion.div>

                  {/* Text Content dengan staggered animation */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <motion.h3
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={cn(
                        'text-xl font-semibold tracking-tight',
                        status === 'success' && 'text-green-600 dark:text-green-400',
                        status === 'loading' && 'text-blue-600 dark:text-blue-400',
                        status === 'error' && 'text-red-600 dark:text-red-400'
                      )}
                    >
                      {title || defaultTitle[status]}
                    </motion.h3>

                    {description && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-base text-gray-600 dark:text-gray-300"
                      >
                        {description}
                      </motion.p>
                    )}
                  </div>

                  {/* Tombol baru dengan posisi dan styling yang lebih menarik */}
                  {(status === 'success' || status === 'error') && buttonText && (
                    <motion.button
                      onClick={() => onButtonClick?.() || onClose()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: 0.3 }}
                      className={cn(
                        'relative mt-2 w-full max-w-[200px]', // Lebar maksimum dan margin top
                        'rounded-xl px-8 py-3.5', // Padding lebih besar
                        'bg-gradient-to-br', // Gradient background
                        status === 'success' && [
                          'from-green-500 to-green-600',
                          'hover:from-green-400 hover:to-green-500',
                          'dark:from-green-600 dark:to-green-700',
                          'dark:hover:from-green-500 dark:hover:to-green-600'
                        ],
                        status === 'error' && [
                          'from-red-500 to-red-600',
                          'hover:from-red-400 hover:to-red-500',
                          'dark:from-red-600 dark:to-red-700',
                          'dark:hover:from-red-500 dark:hover:to-red-600'
                        ],
                        'font-medium tracking-wide text-white', // Text styling
                        'shadow-current/20 shadow-lg', // Subtle shadow
                        'transform transition-all duration-200'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Subtle shine effect */}
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ['-100%', '200%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      </div>

                      <span className="relative z-10">
                        {buttonText || (status === 'error' ? 'Coba Lagi' : 'Kembali')}
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function LoadingAlert() {
  return (
    <div className="relative">
      {/* Outer ring */}
      <motion.div className="absolute h-10 w-10 rounded-full border-[3px] border-blue-100 dark:border-blue-900" />
      {/* Spinning ring */}
      <motion.div
        className="h-10 w-10 rounded-full border-[3px] border-transparent border-t-blue-600 dark:border-t-blue-400"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: 'linear',
          repeat: Infinity
        }}
      />
      {/* Center dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [0.8, 1, 0.8] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
      </motion.div>
    </div>
  )
}

function SuccessAlert() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className="flex items-center justify-center"
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-10 w-10 text-green-600 dark:text-green-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M20 6L9 17L4 12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </motion.svg>
    </motion.div>
  )
}

function ErrorAlert() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="h-8 w-8 text-red-600 dark:text-red-400"
      >
        <motion.path
          d="M18 6L6 18M6 6l12 12"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </motion.svg>
    </div>
  )
}
