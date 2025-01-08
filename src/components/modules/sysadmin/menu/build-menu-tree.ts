'use client'

import { Menu } from '@/types/sysadmin/menu'

interface MenuTreeItem extends Menu {
  level: number
  children: MenuTreeItem[]
}

export function buildMenuTree(menus: Menu[]): MenuTreeItem[] {
  const menuMap = new Map<string, MenuTreeItem>()
  const rootItems: MenuTreeItem[] = []

  // First pass: Create MenuTreeItems and populate the map
  menus.forEach(menu => {
    const treeItem: MenuTreeItem = { ...menu, level: 0, children: [] }
    menuMap.set(menu.id, treeItem)
  })

  // Second pass: Build the tree structure and set correct levels
  function setLevelsAndBuildTree(item: MenuTreeItem, level: number) {
    item.level = level
    if (item.parent_id) {
      const parent = menuMap.get(item.parent_id)
      if (parent) {
        parent.children.push(item)
      } else {
        rootItems.push(item)
      }
    } else {
      rootItems.push(item)
    }

    // Recursively set levels for children
    const childrenToProcess = menus.filter(m => m.parent_id === item.id)
    childrenToProcess.forEach(child => {
      const childItem = menuMap.get(child.id)!
      setLevelsAndBuildTree(childItem, level + 1)
    })
  }

  // Process all items
  menus
    .filter(menu => !menu.parent_id)
    .forEach(rootMenu => {
      const rootItem = menuMap.get(rootMenu.id)!
      setLevelsAndBuildTree(rootItem, 0)
    })

  // Function to flatten the tree structure
  function flattenTree(items: MenuTreeItem[], result: MenuTreeItem[] = []): MenuTreeItem[] {
    items.forEach(item => {
      result.push(item)
      if (item.children.length > 0) {
        flattenTree(item.children, result)
      }
    })
    return result
  }

  // Sort items based on their position in the original array
  function sortByOriginalOrder(a: MenuTreeItem, b: MenuTreeItem): number {
    return menus.findIndex(m => m.id === a.id) - menus.findIndex(m => m.id === b.id)
  }

  // Sort root items and children
  rootItems.sort(sortByOriginalOrder)
  rootItems.forEach(item => {
    item.children.sort(sortByOriginalOrder)
  })

  // Flatten the sorted tree
  return flattenTree(rootItems)
}
