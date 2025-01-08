'use client'

import { DataTableHeaderFilter } from '@/components/ui/data-table/data-table-header-filter'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { STATUS_OPTIONS } from '@/constants/app'
import { useDebounce } from '@/hooks/use-debounce'
import { normalizeStatus } from '@/lib/utils'
import { UserFilterGroups, userFilterParser } from '@/types/sysadmin/user'
import { useEffect, useState } from 'react'
import UserForm from './user-form'
import { useQueryStates } from 'nuqs'

export function UserTableHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [{ keyword, status }, setUserFilter] = useQueryStates(userFilterParser, {
    shallow: false
  })
  const [q, setQ] = useState<string | null>(keyword)
  const debouncedQ = useDebounce(q, 500)

  const filterGroups: UserFilterGroups = [
    {
      id: 'status',
      title: 'Status',
      mode: 'single',
      items: STATUS_OPTIONS
    }
  ]

  useEffect(() => {
    setUserFilter({ keyword: debouncedQ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  return (
    <Modal type="dialog" open={isOpen} onOpenChange={setIsOpen}>
      <DataTableHeaderFilter
        title="Pengguna"
        searchProps={{
          value: q,
          onChange: value => setQ(value ?? ''),
          placeholder: 'Cari pengguna...'
        }}
        filterProps={{
          groups: filterGroups,
          isCanNull: false,
          activeFilters: {
            status: status?.toString() ?? null
          },
          onFilterChange: (groupId, value) => {
            if (groupId === 'status') {
              setUserFilter({
                status: value ? normalizeStatus(value) : null
              })
            }
          }
        }}
        actionButtonProps={{
          label: 'Tambah Pengguna',
          icon: 'lucide:plus',
          onClick: () => setIsOpen(true)
        }}
      />
      <ModalContent hideClose>
        <ModalHeader>
          <ModalTitle>Tambah Pengguna</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <UserForm setIsOpen={setIsOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
