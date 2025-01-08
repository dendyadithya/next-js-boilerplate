import { Check, Info, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

interface CustomToastProps {
  title: string
  description?: string
  type?: 'success' | 'info' | 'error'
  onClose?: () => void
}

export function CustomToast({ title, description, type = 'info', onClose }: CustomToastProps) {
  const variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 100 }
  }

  const iconColors = {
    success: {
      background: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
      icon: 'text-white',
      glow: 'shadow-emerald-500/30'
    },
    info: {
      background: 'bg-gradient-to-r from-blue-400 to-blue-500',
      icon: 'text-white',
      glow: 'shadow-blue-500/30'
    },
    error: {
      background: 'bg-gradient-to-r from-red-400 to-red-500',
      icon: 'text-white',
      glow: 'shadow-red-500/30'
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex w-full min-w-[320px] gap-3 rounded-xl border border-slate-200/20 bg-white/95 p-4',
        'backdrop-blur-sm dark:bg-slate-950/95',
        'shadow-lg shadow-black/5',
        iconColors[type].glow
      )}
    >
      <div className="flex-shrink-0">
        <div className={cn('rounded-full p-2', iconColors[type].background, 'shadow-lg')}>
          {type === 'success' && <Check className={cn('h-5 w-5', iconColors[type].icon)} />}
          {type === 'info' && <Info className={cn('h-5 w-5', iconColors[type].icon)} />}
          {type === 'error' && <AlertCircle className={cn('h-5 w-5', iconColors[type].icon)} />}
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              'font-semibold leading-none tracking-tight',
              type === 'success' && 'text-emerald-700 dark:text-emerald-300',
              type === 'info' && 'text-blue-700 dark:text-blue-300',
              type === 'error' && 'text-red-700 dark:text-red-300'
            )}
          >
            {title}
          </h3>
          {onClose && (
            <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          )}
        </div>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-600 dark:text-slate-400"
          >
            {description}
          </motion.p>
        )}
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4 }}
      />
    </motion.div>
  )
}
