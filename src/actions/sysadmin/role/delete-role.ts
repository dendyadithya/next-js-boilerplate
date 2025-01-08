'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { roleSchema } from '@/types/sysadmin/role'
import { revalidatePath } from 'next/cache'

export const deleteRoleAction = adminActionClient
  .metadata({ actionName: 'deleteRoleAction' })
  .schema(roleSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.delete<string>(`/roles/${parsedInput.id}`)

    if (error && typeof error.message === 'string') {
      throw new Error(error.message)
    }

    revalidatePath('/sysadmin/roles')
    return data
  })
