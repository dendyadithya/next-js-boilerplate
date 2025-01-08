'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { revalidatePath } from 'next/cache'

export const resetPermissionAction = adminActionClient
  .metadata({ actionName: 'resetPermissionAction' })
  .action(async () => {
    const { data, error } = await api.post<string>('/permissions/reset')

    if (error) {
      throw new Error(error.message as string)
    }

    revalidatePath('/sysadmin/permissions')
    return data
  })
