'use client'

import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'
import { startTransition, useEffect } from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { setTokenAdminExpiredClient } from '@/lib/token/token-admin-client'
import { useTransitionRouter } from 'next-view-transitions'

interface ErrorProps {
  error: Error
  reset: () => void
}

function isValidJSON(str: string) {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useTransitionRouter()

  const errorData = isValidJSON(error.message)
    ? (JSON.parse(error.message) as {
        code: number
        message: string
      })
    : {
        code: 500,
        message: error.message
      }

  useEffect(() => {
    if (errorData.code === 419 || errorData.code === 401 || errorData.code === 400) {
      setTokenAdminExpiredClient()

      router.refresh()
    }
  }, [errorData.code, router])

  if (errorData.code === 419 || errorData.code === 401 || errorData.code === 400) {
    return null
  }

  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden p-6">
      <div className="relative z-10 w-full max-w-2xl text-center">
        <AnimatePresence>
          {/* Error Icon dengan Animasi */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Animated Pulse Ring - Warna lebih soft */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.2, 0.4]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute -inset-4 rounded-full bg-orange-200/30 blur-xl dark:bg-orange-900/20"
              />
              <div className="relative rounded-2xl bg-gradient-to-br from-orange-50/80 to-amber-50/80 p-6 shadow-lg backdrop-blur-sm dark:from-orange-900/30 dark:to-amber-900/30">
                <Icon icon="lucide:triangle-alert" className="size-16 text-orange-400 dark:text-orange-300" />
              </div>
            </div>
          </motion.div>

          {/* Error Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-6"
          >
            {/* Title - Gradient lebih soft */}
            <h1 className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-3xl font-bold text-transparent dark:from-orange-300 dark:to-amber-300">
              Oops! Terjadi Kesalahan
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-lg text-lg text-muted-foreground/80">
              Maaf, sepertinya ada masalah dengan permintaan Anda. Jangan khawatir, kami sedang menanganinya!
            </p>

            {/* Error Details - Background lebih transparan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto max-w-lg overflow-hidden rounded-lg border border-orange-100/20 bg-orange-50/10 p-4 backdrop-blur-sm dark:border-orange-900/20 dark:bg-orange-900/10"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground/90">Detail Kesalahan:</p>
                <code className="block rounded bg-background/50 p-3 font-mono text-sm text-muted-foreground/80">
                  {error.message || 'An unexpected error occurred'}
                  {/* {JSON.stringify(error)} */}
                </code>
              </div>
            </motion.div>

            {/* Action Buttons - Gradient lebih soft */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={() => {
                  router.refresh()
                  startTransition(reset)
                }}
                className="group gap-2 bg-gradient-to-r from-orange-400/90 to-amber-400/90 text-white transition-all hover:from-orange-400 hover:to-amber-400 dark:from-orange-500/80 dark:to-amber-500/80"
              >
                <RotateCcw className="size-4 transition-transform group-hover:rotate-180" />
                Coba Lagi
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
                className="gap-2 border-orange-200/20 transition-colors hover:bg-orange-50/10 dark:border-orange-900/20 dark:hover:bg-orange-900/10"
              >
                <ArrowLeft className="size-4" />
                Kembali ke Beranda
              </Button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-sm text-muted-foreground/70">
              Jika masalah berlanjut, silakan hubungi{' '}
              <a
                href="mailto:support@rsudcideres.com"
                className="text-orange-500 hover:text-orange-400 hover:underline dark:text-orange-400"
              >
                Tim IT Support
              </a>
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Decorative Background - Warna lebih soft */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.05),rgba(0,0,0,0))]" />

          {/* Animated Blobs */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
              y: [0, 20, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -left-48 -top-48 size-96 rounded-full bg-orange-200/5 blur-3xl dark:bg-orange-900/5"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -20, 0],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -bottom-48 -right-48 size-96 rounded-full bg-amber-200/5 blur-3xl dark:bg-amber-900/5"
          />
        </div>
      </div>
    </div>
  )
}
