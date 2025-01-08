'use client'

import { DataTable } from '@/components/ui/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { use, useMemo } from 'react'
import { buildMenuTree } from './build-menu-tree'
import { menuTableColumns } from './menu-table-columns'
import { Menu } from '@/types/sysadmin/menu'
import { FetchResponse } from '@/types/fetch'

interface MenuTableProps {
  menusPromise: Promise<FetchResponse<Menu[], false, 'data'>>
}

export default function MenuTable({ menusPromise }: MenuTableProps) {
  const data = use(menusPromise)
  const treeData = buildMenuTree(data?.response?.data || [])

  const columns = useMemo(() => menuTableColumns(), [])
  const { table } = useDataTable({
    data: treeData,
    columns,
    pageCount: -1
  })

  return <DataTable table={table} />
}
