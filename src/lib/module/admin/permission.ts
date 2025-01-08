import { useMenuStore } from '@/stores/menu-store'
import { ActionToPermission, Action } from '@/types/sysadmin/permission'
import { PERMISSION_NAME } from '@/constants/sysadmin/permission'

/**
 * Get permissions for specific module actions
 * @param permissionName - The module permission to check (hover for descriptions)
 * @param actions - Array of actions to check permissions for
 * @returns Object with boolean flags for each action permission
 */
export function getPermission<T extends Action>(
  permissionName: keyof typeof PERMISSION_NAME,
  actions: T[]
): ActionToPermission<T> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { permissions } = useMenuStore()

  const result = {} as ActionToPermission<T>

  // Initialize requested permissions to false
  actions.forEach(action => {
    const key = `can${action.charAt(0).toUpperCase()}${action.slice(1)}` as keyof ActionToPermission<T>
    result[key] = false as ActionToPermission<T>[keyof ActionToPermission<T>]
  })

  permissions.forEach(permission => {
    const [action, resource] = permission.name.split('_')
    if (resource === PERMISSION_NAME[permissionName] && actions.includes(action as T)) {
      const key = `can${action.charAt(0).toUpperCase()}${action.slice(1)}` as keyof ActionToPermission<T>
      result[key] = true as ActionToPermission<T>[keyof ActionToPermission<T>]
    }
  })

  return result
}
