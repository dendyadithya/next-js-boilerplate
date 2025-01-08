'use client'

import { DataTableHeaderFilter } from '@/components/ui/data-table/data-table-header-filter'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect, useState } from 'react'
import MenuForm from './menu-form'
import { useQueryStates } from 'nuqs'
import { menuFilterParser } from '@/types/sysadmin/menu'

export function MenuTableHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [{ keyword }, setMenuFilter] = useQueryStates(menuFilterParser)
  const [q, setQ] = useState<string | null>(keyword)
  const debouncedQ = useDebounce(q, 500)

  useEffect(() => {
    setMenuFilter({ keyword: debouncedQ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  return (
    <Modal type="dialog" open={isOpen} onOpenChange={setIsOpen}>
      <DataTableHeaderFilter
        title="Menu"
        searchProps={{
          value: q,
          onChange: value => setQ(value ?? ''),
          placeholder: 'Cari menu...'
        }}
        actionButtonProps={{
          label: 'Tambah Menu',
          icon: 'lucide:plus',
          onClick: () => setIsOpen(true)
        }}
      />
      <ModalContent hideClose>
        <ModalHeader>
          <ModalTitle>Tambah Menu</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <MenuForm setIsOpen={setIsOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
