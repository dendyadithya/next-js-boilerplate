import AdminContainer from '@/components/admin-container'
import UserTable from '@/components/modules/sysadmin/user/user-table'
import { UserTableHeader } from '@/components/modules/sysadmin/user/user-table-header'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { api } from '@/lib/http/fetch-api'
import { type SearchParams } from 'nuqs/server'
import { User, UserSearchParams, userSearchParamsCache } from '@/types/sysadmin/user'
import { Metadata } from 'next'
import { Suspense } from 'react'

interface UserPageProps {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: 'Pengguna'
}

export default async function UserPage({ searchParams }: UserPageProps) {
  const search = await userSearchParamsCache.parse(searchParams)
  const loadingKey = JSON.stringify(search)

  const usersPromise = api.get<User[], UserSearchParams, true, true>('/users', {
    query: search,
    throw: true
  })

  return (
    <AdminContainer>
      <div className="mb-4 flex gap-4">
        <DataTableToolbar>
          <UserTableHeader />
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
        <UserTable usersPromise={usersPromise} />
      </Suspense>
    </AdminContainer>
  )
}
