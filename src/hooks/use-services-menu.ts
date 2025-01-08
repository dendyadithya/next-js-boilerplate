import { useMenuStore } from '@/stores/menu-store'
import { Menu } from '@/types/sysadmin/menu'

export function useServicesMenu() {
  const { menus } = useMenuStore()
  const filteredMenus = menus
    .filter(menu => menu.is_service_menu === 1)
    .filter(menu => menu.url !== '/')
    .filter(menu => menu.childs?.length)

  return filteredMenus.map(menu => ({
    title: menu.name,
    description: menu.name,
    link: findValidUrl(menu.childs) || '#'
  }))
}

function findValidUrl(childs: Menu[]): string | undefined {
  if (!childs || childs.length === 0) return undefined

  for (const child of childs) {
    if (child.url && child.url !== '-' && !child.url.includes('form-')) {
      return child.url
    }
    const nestedUrl = findValidUrl(child.childs)
    if (nestedUrl) return nestedUrl
  }

  return undefined
}
