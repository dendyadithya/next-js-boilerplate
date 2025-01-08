'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { usePathname } from 'next/navigation'

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname()
  const isKiosk = pathname.includes('/kiosk')

  return (
    <NextThemesProvider forcedTheme={isKiosk ? 'light' : undefined} {...props}>
      {children}
    </NextThemesProvider>
  )
}
