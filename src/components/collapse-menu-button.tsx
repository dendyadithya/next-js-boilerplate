'use client'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Icon from '@/components/ui/icon'

type Submenu = {
  href: string
  label: string
  active: string
}

interface CollapseMenuButtonProps {
  icon: string
  label: string
  active: string
  submenus: Submenu[]
  isOpen: boolean | undefined
}

export function CollapseMenuButton({ icon, label, active, submenus, isOpen }: CollapseMenuButtonProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const isMenuActive = pathname.includes(active) || submenus.some(submenu => pathname.includes(submenu.active))

  useEffect(() => {
    const isSubmenuActive = submenus.some(submenu => pathname.includes(submenu.active))
    setIsCollapsed(isSubmenuActive)
  }, [pathname, submenus])

  return isOpen ? (
    <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className="w-full">
      <CollapsibleTrigger className="mb-2 w-full" asChild>
        <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Button
            variant="ghost"
            className={cn(
              'group relative w-full overflow-hidden rounded-lg transition-all duration-200',
              'hover:bg-accent/50',
              isMenuActive && [
                'bg-gradient-to-r from-primary/10 to-transparent',
                'dark:from-primary/20 dark:to-transparent'
              ]
            )}
          >
            <div className="flex w-full items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-md transition-all duration-200',
                    isMenuActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    'group-hover:bg-primary group-hover:text-primary-foreground'
                  )}
                >
                  <Icon icon={icon} className="size-4" />
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    isMenuActive ? 'text-foreground' : 'text-muted-foreground',
                    'group-hover:text-foreground'
                  )}
                >
                  {label}
                </span>
              </div>
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.2 }} className="mr-2">
                <Icon icon="lucide:chevron-down" className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>

            {isMenuActive && (
              <motion.div
                layoutId="active-menu-indicator"
                className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary"
              />
            )}
          </Button>
        </motion.div>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-1 pl-4">
        {submenus.map(({ href, label, active }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              className={cn(
                'group relative w-full justify-start rounded-md transition-all duration-200',
                'hover:bg-accent/50',
                pathname.includes(active) && 'bg-accent/50 font-medium'
              )}
              asChild
            >
              <Link href={href}>
                <div className="flex items-center gap-3 py-1">
                  <div
                    className={cn(
                      'size-1.5 rounded-full transition-all duration-200',
                      pathname.includes(active) ? 'bg-primary' : 'bg-muted-foreground/40',
                      'group-hover:bg-primary'
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm',
                      pathname.includes(active) ? 'text-foreground' : 'text-muted-foreground',
                      'group-hover:text-foreground'
                    )}
                  >
                    {label}
                  </span>
                </div>
              </Link>
            </Button>
          </motion.div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'relative h-10 w-full justify-center rounded-lg transition-all duration-200',
                  'hover:bg-accent/50',
                  isMenuActive && 'bg-accent/50'
                )}
              >
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-md transition-all duration-200',
                    isMenuActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon icon={icon} className="size-4" />
                </div>
                {isMenuActive && (
                  <motion.div
                    layoutId="active-collapsed-indicator"
                    className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary"
                  />
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent side="right" sideOffset={8} className="min-w-[180px] rounded-lg p-2">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label, active }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                pathname.includes(active) && 'bg-accent'
              )}
            >
              <div
                className={cn(
                  'size-1.5 rounded-full',
                  pathname.includes(active) ? 'bg-primary' : 'bg-muted-foreground/40'
                )}
              />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
