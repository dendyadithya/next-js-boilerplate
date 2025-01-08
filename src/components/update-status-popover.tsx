import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import React from 'react'
import Icon from '@/components/ui/icon'

interface UpdateStatusPopoverProps {
  icon: string
  label: string
  onStatusUpdate: (status: 1 | 0) => void
  currentStatus: 1 | 0
  disabled?: boolean
}

const statuses = [
  {
    label: 'Aktif',
    value: 1,
    icon: 'mdi:check-circle',
    color: 'text-green-500'
  },
  {
    label: 'Tidak Aktif',
    value: 0,
    icon: 'mdi:close-circle',
    color: 'text-red-500'
  }
] as const

export default function UpdateStatusPopover({
  icon,
  label,
  onStatusUpdate,
  currentStatus,
  disabled
}: UpdateStatusPopoverProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'group relative overflow-hidden',
                  'transition-all duration-200',
                  'hover:border-primary/50',
                  'active:scale-95',
                  disabled && 'cursor-not-allowed'
                )}
                disabled={disabled}
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Icon icon={icon} className="size-4" />
                </motion.div>
                <span className="sr-only">{label}</span>
                <span
                  className={cn(
                    'absolute -right-1 -top-1',
                    'size-2.5 rounded-full',
                    'ring-2 ring-background',
                    'shadow-[0_0_8px_rgba(0,0,0,0.15)]',
                    currentStatus === 1 ? 'bg-green-500 ring-green-100/50' : 'bg-red-500 ring-red-100/50'
                  )}
                />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>

          <TooltipContent side="top" className="rounded-md px-3 py-1.5 text-xs">
            <p>{label}</p>
          </TooltipContent>

          <PopoverContent className="w-52 p-1.5" align="end">
            <div className="space-y-1">
              {statuses.map(status => (
                <Button
                  key={status.value}
                  variant="ghost"
                  className={cn(
                    'group w-full justify-start gap-2',
                    'transition-all duration-200',
                    'hover:bg-muted',
                    currentStatus === status.value && 'bg-muted font-medium'
                  )}
                  onClick={() => onStatusUpdate(status.value)}
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Icon icon={status.icon} className={cn('size-4', status.color)} />
                  </motion.div>
                  <span>{status.label}</span>
                  {currentStatus === status.value && (
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className="ml-auto"
                    >
                      <Icon icon="lucide:check" className="size-4 text-primary" />
                    </motion.div>
                  )}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  )
}
