import { Menu } from '@/components/menu'
import { SidebarToggle } from '@/components/sidebar-toggle'
import { UserNav } from '@/components/user-nav'
import { CommandMenu } from '@/components/command-menu'
import { Button } from '@/components/ui/button'
import { useHasMounted } from '@/hooks/use-has-mounted'
import { cn } from '@/lib/utils'
import { useMenuStore } from '@/stores/menu-store'
import { useHydrationStore } from '@/hooks/use-hydration-store'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'

export function Sidebar() {
  const { isOpen, setIsOpen } = useMenuStore()
  const isHydrated = useHydrationStore(useMenuStore)
  const mounted = useHasMounted()

  if (!mounted || !isHydrated) return null

  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className={cn(
        'fixed left-0 top-0 z-20 flex h-screen -translate-x-full flex-col border-r transition-[width] duration-300 ease-in-out lg:translate-x-0',
        'hidden lg:flex',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isOpen === false ? 'w-[70px]' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="relative flex h-14 items-center justify-between px-3">
        <Button variant="ghost" className="h-14 justify-start gap-2 px-2" asChild>
          <Link href="/">
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary p-1.5">
              <Image src="/next.svg" alt="Logo" width={24} height={24} className="h-auto w-full object-contain" />
            </div>
            <span
              className={cn(
                'text-base font-semibold transition-all',
                isOpen === false ? 'hidden w-0 opacity-0' : 'w-auto opacity-100'
              )}
            >
              Admin Kiosk
            </span>
          </Link>
        </Button>
        <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Search Section with Separators */}
      <div className="relative px-3 py-4">
        {/* Top Gradient Separator */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {isOpen ? (
          <CommandMenu className="bg-muted/30 transition-all hover:bg-muted/50 focus:bg-background" />
        ) : (
          <CommandMenu isCollapsed className="ml-2 bg-muted/30 transition-all hover:bg-muted/50 focus:bg-background" />
        )}

        {/* Bottom Gradient Separator */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <Menu isOpen={isOpen} />
      </div>

      {/* Footer Section with UserNav */}
      <div className="relative mb-4 px-3">
        {/* Top Gradient Separator */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mt-4 rounded-lg border bg-card p-1 shadow-sm">
          <UserNav isCollapsed={!isOpen} />
        </div>
      </div>
    </motion.aside>
  )
}
