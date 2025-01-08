'use client'

import { DataTable } from '@/components/ui/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { use, useMemo } from 'react'
import { roleTableColumns } from './role-table-columns'
import { FetchResponse } from '@/types/fetch'
import { Role } from '@/types/sysadmin/role'
import PermissionsOnRolesTable from './permissions-on-roles-table'

interface RoleTableProps {
  rolesPromise: Promise<FetchResponse<Role[], true, 'data'>>
}

export default function RoleTable({ rolesPromise }: RoleTableProps) {
  const data = use(rolesPromise)

  console.log('data', data)

  const columns = useMemo(() => roleTableColumns(), [])
  const { table } = useDataTable({
    data: data?.response?.data || [],
    columns,
    pageCount: data?.response?.meta?.pagination?.total_pages ?? 1,
    rowCount: data?.response?.meta?.pagination?.total ?? 0,
    initialState: {
      isExpanded: true
    }
  })

  return (
    <DataTable table={table} renderSubRow={row => <PermissionsOnRolesTable permissions={row.original.permission} />} />
  )
}
