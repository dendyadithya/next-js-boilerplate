import { deleteCookieClient, getCookieClient, setCookieClient } from '../cookie/cookie-client'

export function getTokenKioskClient() {
  return getCookieClient('tokenKiosk')
}

export function setTokenKioskExpiredClient() {
  setCookieClient('isTokenKioskExpired', true)
  deleteCookieClient('tokenKiosk')
}
