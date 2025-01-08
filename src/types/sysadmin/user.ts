import { z } from 'zod'
import { Role } from './role'
import { FilterGroup } from '@/components/ui/data-table/data-table-header-filter'
import { parseAsInteger, parseAsNumberLiteral, parseAsString, createSearchParamsCache } from 'nuqs/server'

export interface User {
  id: string
  name: string
  username: string
  email: string
  roles: Omit<Role, 'permission'>[]
  status: 1 | 0
}

export type UserWithQrCode = User & { quick_response_code: string }
export type UserFilterGroups = readonly [FilterGroup<'single', 'status'>]

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string({
    required_error: 'Nama tidak boleh kosong'
  }),
  username: z.string({
    required_error: 'Username tidak boleh kosong'
  }),
  email: z
    .string({
      required_error: 'Email tidak boleh kosong'
    })
    .email('Email tidak valid'),
  roles: z.array(z.string(), {
    required_error: 'Silahkan pilih minimal 1 peran'
  }),
  password: z.string({
    required_error: 'Password tidak boleh kosong'
  }),
  status: z.union([z.literal(1), z.literal(0)]).default(1)
})
export type UserSchema = z.infer<typeof userSchema>

export const userFilterParser = {
  keyword: parseAsString.withDefault('').withOptions({
    clearOnDefault: true
  }),
  status: parseAsNumberLiteral([1, 0]).withDefault(1),
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault('email.asc')
}
export const userSearchParamsCache = createSearchParamsCache(userFilterParser)

export const userSearchParamsSchema = z.object({
  keyword: z.string().default(''),
  status: z.union([z.literal(1), z.literal(0)]).default(1),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().default('email.asc')
})
export type UserSearchParams = z.infer<typeof userSearchParamsSchema>
