'use client'

import { DataTable } from '@/components/ui/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { FetchResponse } from '@/types/fetch'
import { Permission } from '@/types/sysadmin/permission'
import { use, useMemo } from 'react'
import { permissionTableColumns } from './permission-table-columns'

interface PermissionTableProps {
  permissionsPromise: Promise<FetchResponse<Permission[], false, 'data'>>
}

export default function PermissionTable({ permissionsPromise }: PermissionTableProps) {
  const data = use(permissionsPromise)
  const columns = useMemo(() => permissionTableColumns(), [])

  const formattedData = useMemo(() => {
    if (!data?.response?.data) return []

    const groupedData = data.response.data.reduce(
      (acc: Record<string, Omit<Permission, 'id'> & { permissions: { id: string; name: string }[] }>, item) => {
        const [, module] = item.name.split('_')
        const formattedModule = module.split('-').join(' ')

        if (!acc[formattedModule]) {
          acc[formattedModule] = {
            name: formattedModule,
            permissions: []
          }
        }

        acc[formattedModule].permissions.push({ id: item.id, name: item.name })

        return acc
      },
      {}
    )

    return Object.values(groupedData)
  }, [data])

  const { table } = useDataTable({
    data: formattedData,
    columns,
    pageCount: -1
  })

  return <DataTable table={table} />
}
