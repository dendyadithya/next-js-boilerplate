'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { UserSchema, userSchema, UserWithQrCode } from '@/types/sysadmin/user'

export const getQrCodeUserAction = adminActionClient
  .metadata({ actionName: 'getQrCodeUserAction' })
  .schema(userSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.get<UserWithQrCode, Pick<UserSchema, 'id'>>(`/users/${parsedInput.id}`)

    if (error) {
      if (typeof error.message === 'string') {
        throw new Error(error.message)
      }

      throw new Error('Unknown error occurred')
    }
    return data.response.data
  })
