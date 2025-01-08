/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchResponse, FetchApiOptions, ErrorValidation, ApiResponse } from '@/types/fetch'
import { getSession } from 'next-auth/react'
import { getUserSession } from '../auth/get-user-session'
import { getTokenKioskClient } from '../token/token-kiosk-client'
import { getTokenKioskServer } from '../token/token-kiosk-server'
import { normalizeFilter } from '../utils'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

// list code error authentication
// 419. 401, 400

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL

function createQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(`${key}[]`, String(v)))
      } else if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  return searchParams.toString() ? `?${searchParams}` : ''
}

interface ExtendedFetchApiOptions<B, Q = never> extends FetchApiOptions<B> {
  query?: Q
  throw?: boolean
  isKiosk?: boolean
}

type FetchApiReturn<D, P extends boolean, K extends string, T extends boolean> = T extends true
  ? FetchResponse<D, P, K>
  : ApiResponse<FetchResponse<D, P, K>, D extends string | number | boolean | null ? ErrorValidation | string : string>

export async function fetchApi<
  D,
  B,
  Q = never,
  P extends boolean = false,
  K extends string = 'data',
  T extends boolean = false
>(
  path: string,
  options: ExtendedFetchApiOptions<B, Q> = {
    isKiosk: false
  }
): Promise<FetchApiReturn<D, P, K, T>> {
  try {
    if (!DEFAULT_BASE_URL) {
      throw new Error('NEXT_PUBLIC_API_URL is not defined')
    }

    const {
      method = 'GET',
      headers = {},
      body,
      query,
      defaultHeaders = DEFAULT_HEADERS,
      baseUrl = DEFAULT_BASE_URL,
      requireAuth = true,
      throw: shouldThrow = false,
      ...restOptions
    } = options

    let fullUrl = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
    if (method === 'GET' && query) {
      fullUrl += createQueryString(query as Record<string, any>)
    }

    let authHeaders = {}
    if (requireAuth) {
      let token: string | undefined

      switch (options.isKiosk) {
        case true:
          const tokenKiosk = typeof window !== 'undefined' ? getTokenKioskClient() : await getTokenKioskServer()
          token = tokenKiosk
          break
        default:
          const session = typeof window !== 'undefined' ? await getSession() : await getUserSession()
          token = session?.token
      }
      if (!token) {
        if (options.throw) {
          throw new Error('Authentication required but no token found')
        }

        return {
          data: null,
          error: {
            code: 401,
            message: 'Authentication required but no token found'
          }
        } as FetchApiReturn<D, P, K, T>
      }

      authHeaders = {
        Authorization: `Bearer ${token}`
      }
    }

    const mergedHeaders = {
      ...defaultHeaders,
      ...authHeaders,
      ...headers
    }

    const fetchOptions: RequestInit = {
      method,
      cache: 'no-store',
      headers: mergedHeaders,
      ...restOptions
    }

    if (method !== 'GET' && body) {
      if (mergedHeaders['Content-Type']?.includes('multipart/form-data')) {
        delete mergedHeaders['Content-Type']

        if (!(body instanceof FormData)) {
          const formData = new FormData()
          Object.entries(body as Record<string, any>).forEach(([key, value]) => {
            if (value instanceof File) {
              formData.append(key, value)
            } else if (value !== null && value !== undefined) {
              formData.append(key, String(value))
            }
          })
          fetchOptions.body = formData
        } else {
          fetchOptions.body = body
        }
      } else {
        fetchOptions.body = JSON.stringify(body)
      }
    }

    const response = await fetch(fullUrl, fetchOptions)
    const responseData = await response.json()

    if (!response.ok) {
      const error = {
        code: response.status,
        message: responseData.metadata?.message || response.statusText
      }

      const errorAuth = {
        419: {
          code: 419,
          isKiosk: options.isKiosk ?? false,
          message: responseData.metadata?.message || response.statusText
        },
        401: {
          code: 401,
          isKiosk: options.isKiosk ?? false,
          message: responseData.metadata?.message || response.statusText
        },
        400: {
          code: 400,
          isKiosk: options.isKiosk ?? false,
          message: responseData.metadata?.message || response.statusText
        }
      }

      if (shouldThrow) {
        if (response.status in errorAuth) {
          throw new Error(JSON.stringify(errorAuth[response.status as keyof typeof errorAuth]))
        }
        throw new Error(error.message)
      }

      return {
        data: null,
        error
      } as FetchApiReturn<D, P, K, T>
    }

    return shouldThrow
      ? (responseData as FetchApiReturn<D, P, K, T>)
      : ({ data: responseData, error: null } as FetchApiReturn<D, P, K, T>)
  } catch (error) {
    if (options.throw) {
      throw error
    }

    return {
      data: null,
      error: {
        code: 500,
        message: JSON.stringify(error)
        // message:
        //   error instanceof Error
        //     ? (error.message as D extends string | number | boolean | null ? ErrorValidation : string)
        //     : ('Unknown error occurred' as D extends string | number | boolean | null ? ErrorValidation : string)
      }
    } as FetchApiReturn<D, P, K, T>
  }
}

// Updated helper functions
export const api = {
  get: async <D, Q = never, P extends boolean = false, T extends boolean = false, K extends string = 'data'>(
    path: string,
    options: Omit<ExtendedFetchApiOptions<never, Q>, 'method' | 'body'> = {}
  ) => {
    const query = options.query as { page?: string; per_page?: string }
    const isPagination = !!query?.page && !!query?.per_page

    return fetchApi<D, never, Q, P, K, T>(path, {
      ...options,
      query: normalizeFilter(options.query as { sort: string }, isPagination),
      method: 'GET'
    })
  },

  post: async <D, B = never, T extends boolean = false, K extends string = 'data'>(
    path: string,
    body?: B,
    options: Omit<ExtendedFetchApiOptions<B>, 'method' | 'body'> = {}
  ) => {
    return fetchApi<D, B, never, false, K, T>(path, {
      ...options,
      method: 'POST',
      body
    })
  },

  put: async <D, B, T extends boolean = false, K extends string = 'data'>(
    path: string,
    body: B,
    options: Omit<ExtendedFetchApiOptions<B>, 'method' | 'body'> = {}
  ) => {
    return fetchApi<D, B, never, false, K, T>(path, {
      ...options,
      method: 'PUT',
      body
    })
  },

  delete: async <D, T extends boolean = false, K extends string = 'data'>(
    path: string,
    options: Omit<ExtendedFetchApiOptions<never>, 'method' | 'body'> = {}
  ) => {
    return fetchApi<D, never, never, false, K, T>(path, {
      ...options,
      method: 'DELETE'
    })
  }
}
