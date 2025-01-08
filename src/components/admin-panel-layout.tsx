'use client'

import { Toaster } from '@/components/ui/sonner'
import { useHasMounted } from '@/hooks/use-has-mounted'
import { cn } from '@/lib/utils'
import { getAllowedUrls } from '@/lib/module/admin/menu'
import { useMenuStore } from '@/stores/menu-store'
import { useHydrationStore } from '@/hooks/use-hydration-store'
import { useSession } from 'next-auth/react'
import { notFound, usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { LoadingLayout } from './loading-layout'

const exclude = ['/login', '/']

export default function MainLayout({ children }: React.PropsWithChildren) {
  const { isOpen, menus } = useMenuStore()
  const isHydrated = useHydrationStore(useMenuStore)
  const mounted = useHasMounted()
  const pathname = usePathname()
  const { status } = useSession()

  const allowedUrls = useMemo(() => getAllowedUrls(menus || []), [menus])
  const currentPath = pathname

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  useEffect(() => {
    if (!isLoading && menus.length !== 0) {
      if (!isAuthenticated && pathname !== '/login') {
        return notFound()
      }

      if (!allowedUrls.includes(currentPath) && pathname !== '/login') {
        return notFound()
      }
    }
  }, [isAuthenticated, isLoading, pathname, allowedUrls, currentPath, menus.length])

  if (!mounted || !isHydrated || isLoading) return <LoadingLayout />

  if (!isAuthenticated && pathname !== '/login') return null

  return (
    <>
      <Toaster />
      {exclude.includes(pathname) ? null : <Sidebar />}
      <main
        className={cn(
          'min-h-screen bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900',
          exclude.includes(pathname) ? 'ml-0' : isOpen === false ? 'lg:ml-[70px]' : 'lg:ml-64'
        )}
      >
        <div>
          {pathname !== '/login' && <Navbar />}
          {children}
        </div>
      </main>
    </>
  )
}
