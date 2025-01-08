import { api } from '@/lib/http/fetch-api'
import { Menu } from '@/types/sysadmin/menu'
import { Permission } from '@/types/sysadmin/permission'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface useMenuStoreProps {
  isOpen: boolean
  setIsOpen: () => void
  menus: Menu[]
  setMenus: (menus: Menu[]) => void
  permissions: Pick<Permission, 'name'>[]
  getPermissionsByUserId: (userId: string) => Promise<{ error: boolean; message: string | null }>
}

export const useMenuStore = create(
  persist<useMenuStoreProps>(
    (set, get) => ({
      isOpen: true,
      menus: [],
      setIsOpen: () => {
        set({ isOpen: !get().isOpen })
      },
      setMenus: (menus: Menu[]) => {
        set({ menus })
      },
      permissions: [],
      getPermissionsByUserId: async (userId: string) => {
        const { data, error } = await api.get<Pick<Permission, 'name'>[]>(`/permissions/get-by-user/${userId}`)

        if (error) return { error: true, message: error.message }

        set({ permissions: data.response.data })

        return { error: false, message: null }
      }
    }),
    {
      name: 'menu-state',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
