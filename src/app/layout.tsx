import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { ThemeProvider } from '@/providers/theme-provider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: {
    template: '%s | RSUD Cideres',
    default: 'RSUD Cideres'
  },
  description: 'RSUD Cideres'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Suspense>
          <ThemeProvider attribute="class" enableSystem>
            <NuqsAdapter>{children}</NuqsAdapter>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
