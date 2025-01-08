'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { validationMapper } from '@/lib/utils'
import { roleSchema } from '@/types/sysadmin/role'
import { revalidatePath } from 'next/cache'

export const updateRoleAction = adminActionClient
  .metadata({ actionName: 'updateRoleAction' })
  .schema(roleSchema)
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.put<string, typeof parsedInput>(`/roles/${parsedInput.id}`, {
      ...parsedInput,
      permissions: parsedInput.permissions?.flatMap(permission => permission)
    })

    if (error) {
      if (error.code === 422 && typeof error.message === 'object') {
        validationMapper(roleSchema, error.message)
      } else if (typeof error.message === 'string') {
        throw new Error(error.message)
      }

      throw new Error('Unknown error occurred')
    }

    revalidatePath('/sysadmin/roles')
    return data
  })
