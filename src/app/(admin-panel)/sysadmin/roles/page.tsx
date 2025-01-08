import AdminContainer from '@/components/admin-container'
import RoleTable from '@/components/modules/sysadmin/role/role-table'
import { RoleTableHeader } from '@/components/modules/sysadmin/role/role-table-header'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { api } from '@/lib/http/fetch-api'
import { type SearchParams } from 'nuqs/server'
import { Role, RoleSearchParams, roleSearchParamsCache } from '@/types/sysadmin/role'
import { Metadata } from 'next'
import { Suspense } from 'react'

interface RolePageProps {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: 'Peran'
}

export default async function RolePage({ searchParams }: RolePageProps) {
  const search = await roleSearchParamsCache.parse(searchParams)
  const loadingKey = JSON.stringify(search)

  const rolesPromise = api.get<Role[], RoleSearchParams, true, true>('/roles', {
    query: search,
    throw: true
  })

  return (
    <AdminContainer>
      <div className="mb-4 flex gap-4">
        <DataTableToolbar>
          <RoleTableHeader />
        </DataTableToolbar>
      </div>
      <Suspense
        key={loadingKey}
        fallback={
          <DataTableSkeleton
            columnCount={6}
            cellWidths={['100px', '100px', '100px', '300px', '50px', '50px']}
            rowCount={15}
            withPagination
          />
        }
      >
        <RoleTable rolesPromise={rolesPromise} />
      </Suspense>
    </AdminContainer>
  )
}
