'use client'

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCommandMenus } from '@/hooks/use-command-menus'
import { cn } from '@/lib/utils'
import { DialogProps } from '@radix-ui/react-dialog'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useTransitionRouter } from 'next-view-transitions'
import * as React from 'react'
import Icon from '@/components/ui/icon'

export function CommandMenu({
  className,
  isCollapsed,
  ...props
}: DialogProps & { className?: string; isCollapsed?: boolean }) {
  const [open, setOpen] = React.useState(false)
  const { setTheme } = useTheme()
  const router = useTransitionRouter()
  const pathname = usePathname()
  const commandMenus = useCommandMenus()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'relative text-sm font-normal transition-all duration-200',
                'flex items-center gap-2',
                isCollapsed
                  ? 'w-9 justify-center px-2' // Style untuk collapsed state
                  : 'w-full justify-start px-3', // Style untuk expanded state
                className
              )}
              onClick={() => setOpen(true)}
              {...props}
            >
              <Icon icon="lucide:search" className="h-4 w-4 text-muted-foreground" />
              {!isCollapsed && (
                <>
                  <span className="inline-flex">Cari...</span>
                  <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </>
              )}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="flex items-center gap-2">
              <span>Cari cepat</span>
              <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-primary">
                <span className="text-xs">⌘</span>K
              </kbd>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari modul atau lainnya..." className="border-none focus:ring-0" isCommandMenu />
        <CommandList>
          <CommandEmpty>Tidak ada data.</CommandEmpty>
          {commandMenus.map(({ groupLabel, commands }, index) => (
            <CommandGroup
              key={index}
              heading={groupLabel}
              className="px-2" // Tambahkan padding
            >
              {commands.map(({ href, label }) => (
                <CommandItem
                  key={href}
                  value={label}
                  onSelect={() => {
                    runCommand(() => router.push(href))
                  }}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-200"
                >
                  <div className="flex h-4 w-4 items-center justify-center">
                    {pathname === href ? (
                      <Icon icon="radix-icons:check-circled" className="h-3 w-3 text-primary" />
                    ) : (
                      <Icon icon="radix-icons:circle" className="h-3 w-3 text-muted-foreground/40" />
                    )}
                  </div>
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator className="mx-2" /> {/* Tambahkan margin */}
          <CommandGroup heading="Tema" className="px-2">
            {' '}
            {/* Tambahkan padding */}
            <CommandItem
              onSelect={() => runCommand(() => setTheme('light'))}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-200"
            >
              <Icon icon="ph:sun-bold" className="h-4 w-4" />
              Terang
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme('dark'))}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-200"
            >
              <Icon icon="ph:moon-bold" className="h-4 w-4" />
              Gelap
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme('system'))}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-200"
            >
              <Icon icon="ph:laptop-bold" className="h-4 w-4" />
              Sistem
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
