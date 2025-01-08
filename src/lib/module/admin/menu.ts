import { Menu } from '@/types/sysadmin/menu'

export function getAllowedUrls(menus: Menu[]): string[] {
  const urls: string[] = []

  function extractUrls(items: Menu[]) {
    items.forEach(item => {
      if (item.url && item.url !== '-') {
        urls.push(item.url)
      }
      if (item.childs && item.childs.length > 0) {
        extractUrls(item.childs)
      }
    })
  }

  extractUrls(menus)
  return urls
}
