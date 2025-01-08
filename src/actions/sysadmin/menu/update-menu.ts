'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { validationMapper } from '@/lib/utils'
import { menuSchema, MenuSchema } from '@/types/sysadmin/menu'
import { revalidatePath } from 'next/cache'

export const updateMenuAction = adminActionClient
  .metadata({
    actionName: 'updateMenuAction'
  })
  .schema(menuSchema)
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.put<string, MenuSchema>(`/menu-managements/${parsedInput.id}`, parsedInput)

    if (error) {
      if (error.code === 422 && typeof error.message === 'object') {
        validationMapper(menuSchema, error.message)
      } else if (typeof error.message === 'string') {
        throw new Error(error.message)
      }

      throw new Error('Unknown error occurred')
    }

    revalidatePath('/sysadmin/menus')
    return data
  })
