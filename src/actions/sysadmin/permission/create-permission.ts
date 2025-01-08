'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { validationMapper } from '@/lib/utils'
import { permissionSchema } from '@/types/sysadmin/permission'
import { revalidatePath } from 'next/cache'

export const createPermissionAction = adminActionClient
  .metadata({ actionName: 'createPermissionAction' })
  .schema(permissionSchema)
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.post<string, { name: string }>('/permissions', {
      name: parsedInput.actionName + '_' + parsedInput.moduleName
    })

    if (error) {
      if (error.code === 422 && typeof error.message === 'object') {
        validationMapper(permissionSchema, error.message)
      } else if (typeof error.message === 'string') {
        throw new Error(error.message)
      }

      throw new Error('Unknown error occurred')
    }

    revalidatePath('/sysadmin/permissions')
    return data
  })
