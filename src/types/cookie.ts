export interface CookieStore {
  tokenKiosk: string
  'next-auth.session-token': string
  isTokenKioskExpired: boolean
  isTokenAdminExpired: boolean

  /**
   * 1 = FKTRL
   * 2 = Klinik Penunjang
   * 3 = Kontrol
   * 4 = Pasca Ranap
   */
  referenceType: 1 | 2 | 3 | 4
  warningReference: {
    referenceNumber: string | null
    referenceType: string | null
  }

  checkInApp: string

  visitType: 'NEW' | 'OLD'
  isPostRanap: 1 | 0
  isPatientMature: boolean
  isKioskForElderly: boolean
  officerTracer: {
    token: string
    username: string
    email: string
    expire_in: number
  }
}
