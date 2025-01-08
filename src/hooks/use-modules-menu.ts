'use client'

import { useMenuStore } from '@/stores/menu-store'
import { Menu, MenuItem } from '@/types/sysadmin/menu'
import { usePathname } from 'next/navigation'

export function useModulesMenu(): { groupLabel: string; items: MenuItem[] } {
  const pathname = usePathname()
  const { menus } = useMenuStore()

  const menuByPath = pathname.split('/')[1] || ''

  const menuFromPath = menus.find(menu => hasValidChild(menu, menuByPath))

  if (!menuFromPath?.childs) return { groupLabel: '', items: [] }

  return {
    groupLabel: menuFromPath.name,
    items: menuFromPath.childs
      .filter(menu => hasValidUrl(getFirstValidUrl(menu), menuByPath))
      .map(menu => ({
        href: getFirstValidUrl(menu),
        label: menu.name,
        icon: menu.icon,
        active: getFirstValidUrl(menu),
        submenus: getSubmenus(menu.childs)
      }))
  }
}

function hasValidChild(menu: Menu, menuByPath: string): boolean {
  return getFirstValidUrl(menu).split('/')[1] === menuByPath
}

function hasValidUrl(url: string, menuByPath: string): boolean {
  return url.split('/')[1] === menuByPath && url !== '-'
}

function getFirstValidUrl(menu: Menu): string {
  if (menu.url !== '-') return menu.url
  if (!menu.childs || menu.childs.length === 0) return '-'

  for (const child of menu.childs) {
    const childUrl = getFirstValidUrl(child)
    if (childUrl !== '-') return childUrl
  }

  return '-'
}

function getSubmenus(childs: Menu[] = []): MenuItem[] {
  return childs
    .filter(submenu => {
      const validUrl = getFirstValidUrl(submenu)
      return validUrl !== '-' && !validUrl.includes('form-')
    })
    .map(submenu => ({
      href: getFirstValidUrl(submenu),
      label: submenu.name,
      icon: submenu.icon,
      active: getFirstValidUrl(submenu),
      submenus: getSubmenus(submenu.childs)
    }))
}
