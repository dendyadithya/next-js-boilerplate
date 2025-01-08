import { Menu } from '@/components/menu'
import { CommandMenu } from '@/components/command-menu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import Icon from '@/components/ui/icon'

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-lg hover:bg-accent/50">
          <div className="flex size-8 items-center justify-center rounded-md transition-all duration-200">
            <Icon
              icon="lucide:menu"
              className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground"
            />
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex h-full flex-col gap-0 border-r p-0 sm:w-72" side="left">
        {/* Logo Section with Gradient Border */}
        <SheetHeader className="relative border-b px-3">
          {/* Logo Area */}
          <div className="py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="relative h-9 w-9 p-0" asChild>
                <Link href="/">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 opacity-50" />
                  <div className="relative flex h-full w-full items-center justify-center">
                    <Image src="/next.svg" alt="Logo" width={24} height={24} className="h-5 w-5 object-contain" />
                  </div>
                </Link>
              </Button>

              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center">
                <span className="text-base font-semibold">Clever HMS</span>
              </motion.div>
            </div>
          </div>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Search Command Area */}
          <div className="py-4">
            <CommandMenu
              className={cn(
                'w-full rounded-lg border border-input bg-background px-3 py-2',
                'text-sm text-muted-foreground',
                'hover:bg-accent/50 hover:text-accent-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'transition-colors duration-200'
              )}
            />
          </div>

          {/* Bottom Gradient Separator */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </SheetHeader>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <Menu isOpen />
        </div>

        {/* Footer Section */}
        <div className="relative border-t px-3 py-3">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 p-2"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
              <Icon icon="lucide:info" className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium">v1.0.0</span>
              <span className="text-xs font-medium text-muted-foreground">Last updated: 2024</span>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
