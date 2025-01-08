'use client'

import { DataTableHeaderFilter } from '@/components/ui/data-table/data-table-header-filter'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect, useState } from 'react'
import { roleFilterParser } from '@/types/sysadmin/role'
import { useTransitionRouter } from 'next-view-transitions'
import { useQueryStates } from 'nuqs'

export function RoleTableHeader() {
  const router = useTransitionRouter()
  const [{ keyword }, setRoleFilter] = useQueryStates(roleFilterParser, {
    shallow: false
  })
  const [q, setQ] = useState<string | null>(keyword)
  const debouncedQ = useDebounce(q, 500)

  useEffect(() => {
    setRoleFilter({ keyword: debouncedQ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  return (
    <DataTableHeaderFilter
      title="Peran"
      searchProps={{
        value: q,
        onChange: value => setQ(value ?? ''),
        placeholder: 'Cari peran...'
      }}
      actionButtonProps={{
        label: 'Tambah Peran',
        icon: 'lucide:plus',
        onClick: () => router.push('/sysadmin/roles/form-role-create')
      }}
    />
  )
}
