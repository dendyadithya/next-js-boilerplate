// Base response type dengan metadata
type BaseResponse<M> = {
  metadata: {
    code: number
    message: M
  }
}

export type ErrorValidation = {
  [key: string]: string[]
}

// Tipe untuk response dengan pagination
type PaginationMeta = {
  pagination?: {
    current_page: number
    needed: boolean
    per_page: number
    skip: number
    total: number
    total_pages: number
  }
}

// Tipe utama dengan conditional type untuk response
export type FetchResponse<D, P extends boolean = false, K extends string = 'data'> = BaseResponse<
  D extends string | number | boolean | null ? ErrorValidation[] | string : string
> & {
  response: D extends string | number | boolean | null
    ? D
    : D extends { __raw: true }
      ? Omit<D, '__raw'> // Jika __raw = true, gunakan data langsung
      : {
          [key in K]: D
        } & {
          meta?: P extends true ? PaginationMeta : undefined
        }
}

// Helper type untuk raw response
export type RawResponse<T> = T & { __raw: true }

export interface FetchApiOptions<B> extends Omit<RequestInit, 'body'> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: B
  defaultHeaders?: Record<string, string>
  baseUrl?: string
  requireAuth?: boolean
}

// Definisikan tipe untuk response wrapper yang lebih spesifik
interface ApiSuccess<T> {
  data: T
  error: null
}

interface ApiError<T> {
  data: null
  error: {
    code: number
    message: T
  }
}

export type ApiResponse<T, M> = ApiSuccess<T> | ApiError<M>
