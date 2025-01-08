import { deleteCookieClient } from '../cookie/cookie-client'

export function resetCookieClient() {
  deleteCookieClient('visitType')
  deleteCookieClient('isPostRanap')
  deleteCookieClient('isPatientMature')
  deleteCookieClient('checkInApp')
  deleteCookieClient('referenceType')
  deleteCookieClient('checkInApp')
  deleteCookieClient('warningReference')
  deleteCookieClient('isKioskForElderly')
}
