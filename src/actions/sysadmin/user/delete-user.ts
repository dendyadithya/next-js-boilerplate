'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { userSchema } from '@/types/sysadmin/user'
import { revalidatePath } from 'next/cache'

export const deleteUserAction = adminActionClient
  .metadata({ actionName: 'deleteUserAction' })
  .schema(userSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.delete<string>(`/users/${parsedInput.id}`)

    if (error && typeof error.message === 'string') {
      throw new Error(error.message)
    }

    revalidatePath('/sysadmin/users')
    return data
  })
