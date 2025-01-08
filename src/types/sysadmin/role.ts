import { z } from 'zod'
import { parseAsInteger, parseAsString, createSearchParamsCache } from 'nuqs/server'
import { Permission } from './permission'

export interface Role {
  id: string
  name: string
  permission: Permission[]
}

export interface ProcessedModule {
  id: string
  name: string
  actions: ProcessedAction[]
}

interface ProcessedAction {
  id: string
  name: string
}

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string({
    required_error: 'Nama peran tidak boleh kosong'
  }),
  permissions: z.array(z.string())
})

export const roleFilterParser = {
  keyword: parseAsString.withDefault('').withOptions({
    clearOnDefault: true
  }),
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault('name.asc')
}
export const roleSearchParamsCache = createSearchParamsCache(roleFilterParser)

export const roleSearchParamsSchema = z.object({
  keyword: z.string().default(''),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().default('name.asc')
})
export type RoleSearchParams = z.infer<typeof roleSearchParamsSchema>
