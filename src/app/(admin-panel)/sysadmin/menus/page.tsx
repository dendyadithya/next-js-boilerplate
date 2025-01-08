import AdminContainer from '@/components/admin-container'
import MenuTable from '@/components/modules/sysadmin/menu/menu-table'
import { MenuTableHeader } from '@/components/modules/sysadmin/menu/menu-table-header'
import { DataTableSkeleton } from '@/components/ui/data-table/data-table-skeleton'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { api } from '@/lib/http/fetch-api'
import { Menu, MenuSearchParams, menuSearchParamsCache } from '@/types/sysadmin/menu'
import { Metadata } from 'next'
import { type SearchParams } from 'nuqs/server'
import { Suspense } from 'react'

interface MenuPageProps {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: 'Menu'
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const search = await menuSearchParamsCache.parse(searchParams)

  const loadingKey = JSON.stringify(search)
  const menusPromise = api.get<Menu[], MenuSearchParams, false, true>('/menu-managements', {
    query: search,
    throw: true
  })

  return (
    <AdminContainer>
      <div className="flex- mb-4 flex gap-4">
        <DataTableToolbar>
          <MenuTableHeader />
        </DataTableToolbar>
      </div>
      <Suspense
        key={loadingKey}
        fallback={
          <DataTableSkeleton
            columnCount={3}
            cellWidths={['300px', '100px', '50px']}
            rowCount={16}
            withPagination={false}
          />
        }
      >
        <MenuTable menusPromise={menusPromise} />
      </Suspense>
    </AdminContainer>
  )
}
