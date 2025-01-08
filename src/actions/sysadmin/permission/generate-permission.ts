'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { validationMapper } from '@/lib/utils'
import { generatePermissionSchema } from '@/types/sysadmin/permission'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const generatePermissionAction = adminActionClient
  .metadata({ actionName: 'generatePermissionAction' })
  .schema(generatePermissionSchema)
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.post<string, { module: string }>('/permissions/generate', parsedInput)

    if (error) {
      if (error?.code === 422 && typeof error.message === 'object') {
        validationMapper(z.object({ module: z.string() }), error.message)
        return
      }

      throw new Error(error.message as string)
    }

    revalidatePath('/sysadmin/permissions')
    return data
  })
