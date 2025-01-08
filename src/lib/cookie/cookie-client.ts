'use client'

import { CookieStore } from '@/types/cookie'
import type { OptionsType } from 'cookies-next'
import { getCookie, setCookie, deleteCookie } from 'cookies-next/client'

// Type helper untuk mendapatkan type value berdasarkan key
type CookieValue<K extends keyof CookieStore> = CookieStore[K]

export function getCookieClient<K extends keyof CookieStore>(key: K, options?: OptionsType): CookieValue<K> {
  const value = getCookie(key, options)

  if (value) {
    // Handle primitive types
    if (value === 'true') return true as unknown as CookieValue<K>
    if (value === 'false') return false as unknown as CookieValue<K>

    if (typeof value === 'string') {
      // Handle boolean

      // Handle number
      const numberValue = Number(value)
      if (!isNaN(numberValue)) {
        return numberValue as CookieValue<K>
      }

      try {
        // Try to parse JSON for objects and arrays
        const parsed = JSON.parse(value)
        if (typeof parsed === 'object') {
          return parsed as CookieValue<K>
        }
      } catch {
        // If not valid JSON, return as is
      }
    }
  }

  return value as CookieValue<K>
}

export function setCookieClient<K extends keyof CookieStore>(key: K, value: CookieValue<K>, options?: OptionsType) {
  let valueToStore: string | CookieValue<K> = value

  // Handle different types
  if (typeof value === 'object') {
    valueToStore = JSON.stringify(value)
  } else if (typeof value === 'boolean') {
    valueToStore = String(value)
  } else if (typeof value === 'number') {
    valueToStore = String(value)
  }

  return setCookie(key, valueToStore, options)
}

export function deleteCookieClient(key: keyof CookieStore, options?: OptionsType) {
  return deleteCookie(key, options)
}
