import { SheetMenu } from '@/components/sheet-menu'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import AutoBreadcrumb from '@/components/auto-breadcrumb'
import Icon from '@/components/ui/icon'

export function Navbar() {
  const isScrolled = false // TODO: Add scroll detection hook

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-40 w-full',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'transition-all duration-200',
        isScrolled && 'border-b shadow-sm'
      )}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SheetMenu />
          <Separator orientation="vertical" className="h-6" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
            <AutoBreadcrumb />
          </motion.div>
        </div>

        {/* Right Section - Notification Only */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className={cn('relative h-10 w-10 rounded-full', 'hover:bg-accent/50', 'transition-all duration-200')}
          >
            <Icon icon="lucide:bell" className="h-5 w-5 text-muted-foreground" />
            {/* Notification Badge with Animation */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                'absolute -right-0.5 -top-0.5',
                'flex h-5 w-5 items-center justify-center',
                'rounded-full border-2 border-background',
                'bg-primary text-[10px] font-medium text-primary-foreground',
                'transition-all duration-200'
              )}
            >
              3
            </motion.span>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
