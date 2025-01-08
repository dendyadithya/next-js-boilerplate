import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Icon from '@/components/ui/icon'

interface SidebarToggleProps {
  isOpen: boolean | undefined
  setIsOpen?: () => void
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute -right-3 top-[50vh] z-20 lg:visible"
    >
      <Button
        onClick={() => setIsOpen?.()}
        className={cn(
          'h-6 w-6 rounded-full p-0.5 shadow-lg',
          'bg-background hover:bg-accent',
          'border border-border/50'
        )}
        variant="ghost"
        size="icon"
      >
        <Icon
          icon="lucide:chevrons-left"
          className={cn('h-4 w-4 transition-all duration-300', isOpen === false ? 'rotate-180' : 'rotate-0')}
        />
      </Button>
    </motion.div>
  )
}
