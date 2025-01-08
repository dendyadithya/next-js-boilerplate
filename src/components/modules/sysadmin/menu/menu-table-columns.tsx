/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { deleteMenuAction } from '@/actions/sysadmin/menu/delete-menu'
import BaseActionCell from '@/components/base-action-cell'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { Menu } from '@/types/sysadmin/menu'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner'
import MenuForm from './menu-form'
import { getPermission } from '@/lib/module/admin/permission'

export function menuTableColumns(): ColumnDef<Menu & { level: number }>[] {
  return [
    {
      accessorKey: 'name',
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Nama" />
      },
      cell: ({ row }) => <div style={{ marginLeft: `${row.original.level * 20}px` }}>{row.original.name}</div>,
      size: 300
    },
    {
      accessorKey: 'roles',
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Peran" />
      },
      size: 100
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: () => null,
      cell: ({ row }) => {
        const { canEdit, canDelete } = getPermission('MENU_MANAGEMENTS', ['edit', 'delete'])

        const [isOpen, setIsOpen] = useState<boolean>(false)

        return (
          <Modal type="dialog" open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex flex-1 justify-center">
              <BaseActionCell
                actions={[
                  {
                    name: 'edit',
                    disable: !canEdit,
                    label: 'Edit',
                    onClick: () => setIsOpen(true)
                  },
                  {
                    name: 'delete',
                    disable: !canDelete,
                    label: 'Hapus',
                    titleDialog: `Apakah Anda yakin ingin menghapus ${row.original.name}?`,
                    onDelete: () => {
                      toast.promise(
                        deleteMenuAction({
                          id: row.original.id
                        }),
                        {
                          loading: 'Menghapus...',
                          success: data => {
                            if (data?.serverError) {
                              throw data?.serverError
                            }

                            return 'Berhasil menghapus'
                          },
                          error: 'Gagal menghapus'
                        }
                      )
                    }
                  }
                ]}
              />

              <ModalContent hideClose>
                <ModalHeader>
                  <ModalTitle>Edit Menu</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <MenuForm
                    setIsOpen={isOpen => setIsOpen(isOpen)}
                    defaultValues={{
                      ...row.original,
                      roles: row.original.roles,
                      parent_id: row.original.parent_id || ''
                    }}
                  />
                </ModalBody>
              </ModalContent>
            </div>
          </Modal>
        )
      },
      size: 40
    }
  ]
}
