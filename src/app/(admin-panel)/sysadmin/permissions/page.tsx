import AdminContainer from '@/components/admin-container'
import PermissionTable from '@/components/modules/sysadmin/permission/permission-table'
import { PermissionTableHeader } from '@/components/modules/sysadmin/permission/permission-table-header'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { api } from '@/lib/http/fetch-api'
import { Permission, PermissionSearchParams, permissionSearchParamsCache } from '@/types/sysadmin/permission'
import { Metadata } from 'next'
import { type SearchParams } from 'nuqs/server'
import { Suspense } from 'react'

interface PermissionFilters {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: 'Hak Akses'
}

export default async function PermissionPage({ searchParams }: PermissionFilters) {
  const search = await permissionSearchParamsCache.parse(searchParams)
  const loadingKey = JSON.stringify(search)

  const permissionsPromise = api.get<Permission[], PermissionSearchParams, false, true>('/permissions', {
    query: search,
    throw: true
  })

  return (
    <AdminContainer>
      <div className="flex- mb-4 flex gap-4">
        <DataTableToolbar>
          <PermissionTableHeader />
        </DataTableToolbar>
      </div>
      <Suspense
        key={loadingKey}
        fallback={
          <DataTableSkeleton columnCount={2} cellWidths={['200px', '200px']} rowCount={15} withPagination={false} />
        }
      >
        <PermissionTable permissionsPromise={permissionsPromise} />
      </Suspense>
    </AdminContainer>
  )
}
