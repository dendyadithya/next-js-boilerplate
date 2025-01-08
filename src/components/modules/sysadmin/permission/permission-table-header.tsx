'use client'

import { resetPermissionAction } from '@/actions/sysadmin/permission/reset-permission'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { DataTableHeaderFilter } from '@/components/ui/data-table/data-table-header-filter'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal'
import { useDebounce } from '@/hooks/use-debounce'
import { useQueryStates } from 'nuqs'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import GeneratePermissionForm from './generate-permission-form'
import PermissionForm from './permission-form'
import { permissionFilterParser } from '@/types/sysadmin/permission'

export function PermissionTableHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'generate' | 'add'>('add')
  const [{ keyword }, setPermissionFilter] = useQueryStates(permissionFilterParser, {
    shallow: false
  })
  const [q, setQ] = useState<string | null>(keyword)
  const debouncedQ = useDebounce(q, 500)

  useEffect(() => {
    setPermissionFilter({ keyword: debouncedQ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  return (
    <Modal type="dialog" open={isOpen} onOpenChange={setIsOpen}>
      <DataTableHeaderFilter
        title="Hak Akses"
        searchProps={{
          value: q,
          onChange: value => setQ(value ?? ''),
          placeholder: 'Cari hak akses...'
        }}
        actionButtonProps={{
          label: 'Tambah Hak Akses',
          icon: 'lucide:plus',
          onClick: () => setIsOpen(true)
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10">
              <Icon icon="lucide:ellipsis" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ModalTrigger asChild>
              <DropdownMenuItem onClick={() => setModalType('generate')}>Generate</DropdownMenuItem>
            </ModalTrigger>
            <DropdownMenuItem
              onClick={async () =>
                toast.promise(resetPermissionAction(), {
                  loading: 'Sedang mereset hak akses...',
                  success: data => {
                    if (data?.serverError) {
                      throw data?.serverError
                    }

                    return 'Berhasil mereset hak akses'
                  },
                  error: 'Gagal mereset hak akses'
                })
              }
            >
              Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DataTableHeaderFilter>

      <ModalContent hideClose>
        <ModalHeader>
          <ModalTitle>{modalType === 'generate' ? 'Generate Hak Akses' : 'Tambah Hak Akses'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {modalType === 'generate' && <GeneratePermissionForm setIsOpen={setIsOpen} />}
          {modalType === 'add' && <PermissionForm setIsOpen={setIsOpen} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
