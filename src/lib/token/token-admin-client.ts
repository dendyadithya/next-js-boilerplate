import { deleteCookieClient, getCookieClient, setCookieClient } from '../cookie/cookie-client'

export function getTokenAdminClient() {
  return getCookieClient('next-auth.session-token')
}

export function setTokenAdminExpiredClient() {
  setCookieClient('isTokenAdminExpired', true)
  deleteCookieClient('next-auth.session-token')
}
