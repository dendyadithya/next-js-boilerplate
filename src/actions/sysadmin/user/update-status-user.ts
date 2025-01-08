'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { userSchema } from '@/types/sysadmin/user'
import { revalidatePath } from 'next/cache'

export const updateStatusUserAction = adminActionClient
  .metadata({ actionName: 'updateStatusUserAction' })
  .schema(userSchema.pick({ id: true, status: true }))
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.put<string, typeof parsedInput>(`/users/${parsedInput.id}/status`, {
      ...parsedInput
    })

    if (error && typeof error.message === 'string') {
      throw new Error(error.message)
    }

    revalidatePath('/sysadmin/users')
    return data
  })
