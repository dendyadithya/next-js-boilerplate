import { useMenuStore } from '@/stores/menu-store'
import { Breadcrumb, Menu } from '@/types/sysadmin/menu'
import { usePathname } from 'next/navigation'

export function useBreadcrumbs(): Breadcrumb[] {
  const { menus } = useMenuStore()
  const pathname = usePathname()

  const findMenuItemAndParents = (path: string): Menu[] => {
    const result: Menu[] = []

    const findInMenu = (menu: Menu, parents: Menu[]): boolean => {
      if (menu.url === path) {
        result.push(...parents, menu)
        return true
      }
      if (menu.childs) {
        for (const child of menu.childs) {
          if (findInMenu(child, [...parents, menu])) {
            return true
          }
        }
      }
      return false
    }

    for (const menu of menus) {
      if (findInMenu(menu, [])) break
    }

    return result
  }

  const createBreadcrumb = (menu: Menu): Breadcrumb => ({
    href: menu.url,
    label: menu.name,
    active: menu.url
  })

  const menuPath = findMenuItemAndParents(pathname)

  // Tambahkan home jika belum ada
  if (menuPath[0]?.url !== '/') {
    const homeMenu = menus.find(menu => menu.url === '/')
    if (homeMenu) {
      menuPath.unshift(homeMenu)
    }
  }

  return menuPath.map(createBreadcrumb)
}
