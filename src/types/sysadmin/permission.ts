import { z } from 'zod'
import { parseAsString, createSearchParamsCache } from 'nuqs/server'

export interface Permission {
  id: string
  name: string
}

export type Action = 'add' | 'view' | 'edit' | 'delete' | 'aprove' | 'print' | 'download' | 'sign'

export type ActionToPermission<T extends Action> = {
  [K in T as `can${Capitalize<K>}`]: boolean
}

export const permissionSchema = z.object({
  id: z.string().optional(),
  moduleName: z.string().min(1, { message: 'Nama modul tidak boleh kosong' }),
  actionName: z.string().min(1, { message: 'Nama aksi tidak boleh kosong' })
})
export type PermissionSchema = z.infer<typeof permissionSchema>

export const generatePermissionSchema = z.object({
  module: z.string().min(1, { message: 'Nama modul tidak boleh kosong' })
})
export type GeneratePermissionSchema = z.infer<typeof generatePermissionSchema>
export const permissionFilterParser = {
  keyword: parseAsString.withDefault('').withOptions({
    clearOnDefault: true
  }),
  sort: parseAsString.withDefault('name.asc')
}
export const permissionSearchParamsCache = createSearchParamsCache(permissionFilterParser)

export const permissionSearchParamsSchema = z.object({
  keyword: z.string().default(''),
  sort: z.string().default('name.asc')
})
export type PermissionSearchParams = z.infer<typeof permissionSearchParamsSchema>
