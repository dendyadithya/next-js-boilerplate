'use client'

import { CollapseMenuButton } from '@/components/collapse-menu-button'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useModulesMenu } from '@/hooks/use-modules-menu'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import Icon from '@/components/ui/icon'
import TextWithOverflowTooltip from '@/components/text-with-overflow-tooltip'

interface MenuProps {
  isOpen: boolean | undefined
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname()
  const menus = useModulesMenu()

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className={cn('mt-2 h-full w-full', isOpen ? 'px-2' : 'px-1')}>
        <div className="space-y-1">
          {menus.groupLabel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('mb-4 flex flex-col gap-1', isOpen ? 'px-1' : 'px-2')}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                    <span className="text-[10px] font-medium uppercase text-muted-foreground">Modul Saat Ini</span>
                    <span className="text-sm font-medium text-primary">{menus.groupLabel}</span>
                  </motion.div>
                )}
              </div>
              <div className="ml-2.5 h-3 w-[1px] bg-gradient-to-b from-primary/50 to-transparent" />
            </motion.div>
          )}
          {menus.items.map(({ href, label, icon, active, submenus }, index) =>
            submenus.length === 0 ? (
              <Fragment key={index}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <Button
                          variant="ghost"
                          className={cn(
                            'group relative overflow-hidden rounded-lg transition-all duration-200',
                            'hover:bg-accent/50 hover:shadow-sm',
                            isOpen ? 'w-full justify-start p-2.5' : 'h-10 w-10 p-0',
                            pathname.includes(active) && [
                              'bg-gradient-to-r from-primary/10 to-transparent',
                              'dark:from-primary/20 dark:to-transparent',
                              'font-medium'
                            ]
                          )}
                          asChild
                        >
                          <Link href={href}>
                            <div
                              className={cn('flex items-center', isOpen ? 'w-full gap-3' : 'h-10 w-10 justify-center')}
                            >
                              <div
                                className={cn(
                                  'flex size-8 items-center justify-center rounded-md transition-all duration-200',
                                  pathname.includes(active)
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted text-muted-foreground',
                                  'group-hover:bg-primary group-hover:text-primary-foreground'
                                )}
                              >
                                <Icon icon={icon} className="size-4" />
                              </div>

                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden"
                                >
                                  <TextWithOverflowTooltip
                                    text={label}
                                    className={cn(
                                      'w-full text-sm font-medium transition-colors duration-200',
                                      'hover:text-foreground/90',
                                      pathname.includes(active) ? 'text-foreground' : 'text-muted-foreground'
                                    )}
                                    isActive={pathname.includes(active)}
                                  />
                                </motion.div>
                              )}
                            </div>

                            {pathname.includes(active) && isOpen && (
                              <>
                                {/* Left indicator */}
                                <motion.div
                                  layoutId="active-indicator-left"
                                  className={cn('absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary')}
                                />
                                {/* Background gradient animation */}
                                <motion.div
                                  layoutId="active-bg"
                                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                />
                                {/* Optional: Subtle pattern overlay */}
                                <div className="pattern-grid absolute inset-0 opacity-[0.03] mix-blend-overlay" />
                              </>
                            )}
                          </Link>
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent sideOffset={12} side="right">
                        {label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </Fragment>
            ) : (
              <div key={index} className="w-full">
                <CollapseMenuButton icon={icon} label={label} active={active} submenus={submenus} isOpen={isOpen} />
              </div>
            )
          )}
        </div>
      </nav>
    </ScrollArea>
  )
}
