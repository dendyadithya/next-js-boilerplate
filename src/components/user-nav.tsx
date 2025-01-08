'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useMenuStore } from '@/stores/menu-store'
import { motion } from 'motion/react'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Icon from '@/components/ui/icon'

interface UserNavProps {
  isCollapsed?: boolean
}

export function UserNav({ isCollapsed }: UserNavProps) {
  const session = useSession()
  const { setMenus } = useMenuStore()
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'group relative w-full gap-3 rounded-md p-2',
            'hover:bg-accent/50',
            'transition-all duration-200 ease-in-out',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <div className="relative">
            <Avatar className={cn('h-9 w-9 border-2 border-transparent transition-all', 'group-hover:border-border')}>
              <AvatarImage src="#" alt={session.data?.name || ''} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                {session.data?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
          </div>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-1 flex-col items-start gap-1"
            >
              <p className="text-sm font-medium leading-none">{session.data?.name}</p>
              <p className="text-xs text-muted-foreground">{session.data?.email}</p>
            </motion.div>
          )}

          {!isCollapsed && (
            <Icon
              icon="lucide:chevron-down"
              className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 p-2" align="end" side="right" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 pb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="#" alt={session.data?.name || ''} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                {session.data?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium leading-none">{session.data?.name}</p>
              <p className="text-xs text-muted-foreground">{session.data?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Theme Options */}
        <div className="p-1">
          <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2 rounded-md px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/50">
              <Icon icon="lucide:sun" className="h-4 w-4" />
            </div>
            <span>Terang</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2 rounded-md px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/50">
              <Icon icon="lucide:moon" className="h-4 w-4" />
            </div>
            <span>Gelap</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Logout Option */}
        <div className="p-1">
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-md px-2 text-destructive focus:text-destructive"
            onClick={async () => {
              setMenus([])
              await signOut()
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10">
              <Icon icon="lucide:log-out" className="h-4 w-4" />
            </div>
            <span>Keluar</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
