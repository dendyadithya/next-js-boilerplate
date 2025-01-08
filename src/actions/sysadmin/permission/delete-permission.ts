'use server'

import { api } from '@/lib/http/fetch-api'
import { adminActionClient } from '@/lib/http/safe-action'
import { permissionSchema } from '@/types/sysadmin/permission'
import { revalidatePath } from 'next/cache'

export const deletePermissionAction = adminActionClient
  .metadata({ actionName: 'deletePermissionAction' })
  .schema(permissionSchema.pick({ id: true }))
  .action(async ({ parsedInput }) => {
    const { data, error } = await api.delete<string>(`/permissions/${parsedInput.id}`)

    if (error) {
      throw new Error(error.message as string)
    }

    revalidatePath('/sysadmin/permissions')
    return data
  })
