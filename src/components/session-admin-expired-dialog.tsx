'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { deleteCookieClient, getCookieClient } from '@/lib/cookie/cookie-client'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function SessionAdminExpiredDialog() {
  const pathname = usePathname()
  const isTokenAdminExpired = getCookieClient('isTokenAdminExpired')

  const handleConfirm = async () => {
    await signOut()
    deleteCookieClient('isTokenAdminExpired')
  }

  if (pathname === '/login') {
    return null
  }

  return (
    <AlertDialog open={isTokenAdminExpired}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sesi Anda Telah Berakhir</AlertDialogTitle>
          <AlertDialogDescription>
            Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>Login Kembali</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
