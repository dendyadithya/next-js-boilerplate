'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { menuSchema } from '@/types/sysadmin/menu'
import { revalidatePath } from 'next/cache'

export const deleteMenuAction = adminActionClient
  .metadata({
    actionName: 'deleteMenuAction'
  })
  .schema(menuSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.delete<string>(`/menu-managements/${parsedInput.id}`)

    if (error) {
      throw new Error(error.message as string)
    }

    revalidatePath('/sysadmin/menus')
    return data
  })
