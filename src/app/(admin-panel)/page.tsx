import ServiceList from '@/components/modules/home/service-list'
import { CommandMenu } from '@/components/command-menu'
import GridPattern from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { api } from '@/lib/http/fetch-api'
import { User } from '@/types/sysadmin/user'
import { getUserSession } from '@/lib/auth/get-user-session'
import { setCookieServer } from '@/lib/cookie/cookie-server'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Beranda'
}

export default async function Home() {
  const session = await getUserSession()
  async function setTokenExpiredCookie() {
    await setCookieServer('isTokenAdminExpired', true, { cookies })
  }

  if (!session) {
    setTokenExpiredCookie()
  }

  await api
    .get<User, never, false, true>(`users/${session?.id}`, {
      throw: true
    })
    .catch((error: { code: number }) => {
      if (error.code === 401) {
        setTokenExpiredCookie()
      }
    })

  return (
    <Suspense>
      <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
        <div className="absolute left-1/2 top-8 z-10 w-full max-w-lg -translate-x-1/2 px-4">
          <div className="rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mb-2 text-center">
              <h2 className="mb-2 font-semibold">Akses Cepat</h2>
              <p className="text-sm text-muted-foreground">
                Tekan{' '}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  <span className="text-xs">⌘</span>K
                </kbd>{' '}
                untuk pencarian cepat semua fitur
              </p>
            </div>
            <CommandMenu className="w-full" />
          </div>
        </div>

        <ServiceList />
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 20],
            [10, 15],
            [15, 20],
            [10, 15],
            [15, 20],
            [30, 15]
          ]}
          className={cn(
            '[mask-image:radial-gradient(1100px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[-10%] h-[200%] skew-y-12'
          )}
        />
      </div>
    </Suspense>
  )
}
