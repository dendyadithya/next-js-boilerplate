'use client'

import { useMenuStore } from '@/stores/menu-store'
import { Menu } from '@/types/sysadmin/menu'

interface CommandMenuItem {
  href: string
  label: string
}

interface CommandMenuGroup {
  groupLabel: string
  commands: CommandMenuItem[]
}

function processMenuItems(items: Menu[]): CommandMenuGroup[] {
  const result: CommandMenuGroup[] = []

  function traverse(item: Menu, parentLabels: string[] = []) {
    if (item.url === '-') {
      // This is a group, add it to result if it doesn't exist
      let group = result.find(g => g.groupLabel === item.name)
      if (!group) {
        group = { groupLabel: item.name, commands: [] }
        result.push(group)
      }

      // Process children if any
      for (const child of item.childs) {
        traverse(child, [...parentLabels, item.name])
      }
    } else {
      // This is a command item
      const commandItem: CommandMenuItem = {
        href: item.url,
        label: item.name
      }

      // Add the command to the last group or create a new group
      if (parentLabels.length > 0) {
        const groupLabel = parentLabels[parentLabels.length - 1]
        let group = result.find(g => g.groupLabel === groupLabel)
        if (!group) {
          group = { groupLabel, commands: [] }
          result.push(group)
        }
        group.commands.push(commandItem)
      } else {
        // If there's no parent group, create a default group
        let defaultGroup = result.find(g => g.groupLabel === 'General')
        if (!defaultGroup) {
          defaultGroup = { groupLabel: 'General', commands: [] }
          result.push(defaultGroup)
        }
        defaultGroup.commands.push(commandItem)
      }
    }
  }

  for (const item of items) {
    traverse(item)
  }

  return result
}

export function useCommandMenus(): CommandMenuGroup[] {
  const { menus } = useMenuStore()

  const commandMenus = processMenuItems(menus.filter(menu => menu.url !== '/'))

  return commandMenus
}
