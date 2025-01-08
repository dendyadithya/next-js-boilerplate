'use client'

import { DataTable } from '@/components/ui/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { use, useMemo } from 'react'
import { userTableColumns } from './user-table-columns'
import { User } from '@/types/sysadmin/user'
import { FetchResponse } from '@/types/fetch'

interface UserTableProps {
  usersPromise: Promise<FetchResponse<User[], true, 'data'>>
}

export default function UserTable({ usersPromise }: UserTableProps) {
  const data = use(usersPromise)

  const columns = useMemo(() => userTableColumns(), [])
  const { table } = useDataTable({
    data: data?.response?.data || [],
    columns,
    pageCount: data?.response?.meta?.pagination?.total_pages ?? 1,
    rowCount: data?.response?.meta?.pagination?.total ?? 0
  })

  return <DataTable table={table} />
}
