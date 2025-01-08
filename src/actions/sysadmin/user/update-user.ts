'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { validationMapper } from '@/lib/utils'
import { userSchema } from '@/types/sysadmin/user'
import { revalidatePath } from 'next/cache'

export const updateUserAction = adminActionClient
  .metadata({ actionName: 'updateUserAction' })
  .schema(userSchema)
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.put<string, typeof parsedInput>(`/users/${parsedInput.id}`, {
      ...parsedInput,
      roles: parsedInput.roles?.flatMap(role => role)
    })

    if (error) {
      if (error.code === 422 && typeof error.message === 'object') {
        validationMapper(userSchema, error.message)
      } else if (typeof error.message === 'string') {
        throw new Error(error.message)
      }

      throw new Error('Unknown error occurred')
    }

    revalidatePath('/sysadmin/users')
    return data
  })
