import { ErrorValidation } from '@/types/fetch'
import { clsx, type ClassValue } from 'clsx'
import { returnValidationErrors } from 'next-safe-action'
import { twMerge } from 'tailwind-merge'
import { ZodType } from 'zod'
import { KIOSK_PAGES } from '@/constants/app'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytest') : (sizes[i] ?? 'Bytes')
  }`
}

export function validationMapper(schema: ZodType, errors: ErrorValidation) {
  // Construct the validation errors object dynamically
  const validationErrors = Object.entries(errors).reduce(
    (acc: { [key: string]: { _errors: string[] } }, [key, value]) => {
      if (!acc[key]) {
        acc[key] = { _errors: [] }
      }
      acc[key]._errors.push(...value)
      return acc
    },
    {}
  )

  // Use the dynamically constructed validation errors object
  return returnValidationErrors(schema, validationErrors)
}

export function normalizeStatus(status: unknown): 1 | 0 {
  if (typeof status === 'string') {
    const lowercaseStatus = status.toLowerCase()
    if (['0', 'false', 'tidak aktif', 'inactive'].includes(lowercaseStatus)) {
      return 0
    }
    if (['1', 'true', 'aktif', 'active'].includes(lowercaseStatus)) {
      return 1
    }
  }

  if (typeof status === 'number') {
    return status === 0 ? 0 : 1
  }

  if (typeof status === 'boolean') {
    return status ? 1 : 0
  }

  // Default case: return 0 for any unrecognized input
  return 0
}

export function convertExpiredIn(expiredInSeconds: number | undefined) {
  if (!expiredInSeconds) {
    return {
      date: null,
      timestamp: 0,
      isExpired: true,
      formattedDate: null
    }
  }

  // Dapatkan waktu sekarang dalam milliseconds
  const now = new Date()

  // Hitung waktu expired dengan menambahkan detik ke waktu sekarang
  const expiredDate = new Date(now.getTime() + expiredInSeconds * 1000)

  // Bandingkan timestamp untuk cek expired
  const isExpired = expiredDate.getTime() <= now.getTime()

  // Format tanggal untuk display
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(expiredDate)

  return {
    date: expiredDate,
    timestamp: expiredDate.getTime(),
    isExpired,
    formattedDate
  }
}

export function getTitleKiosk(pathname: string) {
  const title = Object.values(KIOSK_PAGES).find(page => page.url === pathname)?.title

  return title
}

export function normalizeFilter<T extends { sort?: string; page?: string; per_page?: string }, P extends boolean, Q>(
  query: T | undefined,
  isPagination: P
): Q {
  if (!query) return {} as Q

  const { sort, page, per_page, ...restQuery } = query
  const [sortBy, orderBy] = sort?.split('.') ?? []

  if (!sort) {
    return {
      ...restQuery,
      paginate: isPagination
    } as Q
  }

  if (!isPagination && !page && !per_page) {
    return {
      ...restQuery,
      paginate: isPagination,
      sort_by: sortBy,
      order_by: orderBy
    } as Q
  }

  return {
    ...restQuery,
    page: page,
    per_page: per_page,
    paginate: isPagination,
    sort_by: sortBy,
    order_by: orderBy
  } as Q
}
