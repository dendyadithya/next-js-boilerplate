'use server'

import { deleteCookieServer, getCookieServer, setCookieServer } from '../cookie/cookie-server'
import { cookies } from 'next/headers'

export async function getTokenKioskServer() {
  return await getCookieServer('tokenKiosk', { cookies })
}

export async function setTokenKioskExpiredServer() {
  await setCookieServer('isTokenKioskExpired', true, { cookies })
  await deleteCookieServer('tokenKiosk', { cookies })
}
