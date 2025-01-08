import { createSearchParamsCache, parseAsString } from 'nuqs/server'
import { z } from 'zod'

export interface Menu {
  id: string
  name: string
  icon: string
  url: string
  roles: string
  created_at: string
  updated_at: string
  parent_id?: string | null
  is_service_menu: 1 | 0
  childs: Menu[]
}

type SubmenuItem = {
  href: string
  label: string
  active: string
}
export type MenuItem = {
  href: string
  label: string
  active: string
  icon: string
  submenus: SubmenuItem[]
}
export type Breadcrumb = MenuItem | SubmenuItem

export const menuSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  icon: z.string(),
  roles: z.string(),
  is_service_menu: z.union([z.literal(1), z.literal(0)]).default(0),
  parent_id: z.string().optional().nullable()
})
export type MenuSchema = z.infer<typeof menuSchema>

export const menuFilterParser = {
  keyword: parseAsString.withDefault('').withOptions({
    clearOnDefault: true
  }),
  sort: parseAsString.withDefault('name.asc')
}
export const menuSearchParamsCache = createSearchParamsCache(menuFilterParser)

export const menuSearchParamsSchema = z.object({
  keyword: z.string().default(''),
  sort: z.string().default('name.asc')
})
export type MenuSearchParams = z.infer<typeof menuSearchParamsSchema>
