'use server'

import { deleteCookieServer, getCookieServer, setCookieServer } from '../cookie/cookie-server'
import { cookies } from 'next/headers'

export async function getTokenAdminServer() {
  return await getCookieServer('next-auth.session-token', { cookies })
}

export async function setTokenAdminExpiredServer() {
  await setCookieServer('isTokenAdminExpired', true, { cookies })
  await deleteCookieServer('next-auth.session-token', { cookies })
}
