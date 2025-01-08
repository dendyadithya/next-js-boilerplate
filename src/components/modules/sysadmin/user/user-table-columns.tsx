/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { deleteUserAction } from '@/actions/sysadmin/user/delete-user'
import { updateStatusUserAction } from '@/actions/sysadmin/user/update-status-user'
import BaseActionCell from '@/components/base-action-cell'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { User, UserWithQrCode } from '@/types/sysadmin/user'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner'
import UserForm from './user-form'
import { QRCodeUser } from './qr-code-user'
import { useAction } from 'next-safe-action/hooks'
import { getQrCodeUserAction } from '@/actions/sysadmin/user/get-qr-code-user'
import { getPermission } from '@/lib/module/admin/permission'

export function userTableColumns(): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      enableHiding: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Nama" />
      }
    },
    {
      accessorKey: 'username',
      enableHiding: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Username" />
      }
    },
    {
      accessorKey: 'email',
      enableHiding: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Email" />
      },
      size: 100,
      meta: {
        canResize: true
      }
    },
    {
      accessorKey: 'roles',
      enableHiding: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Peran" />
      },
      cell: ({ row }) => row.original.roles.flatMap(role => role.name).join(', '),
      size: 300
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      meta: {
        pin: 'right'
      },
      header: '',
      cell: ({ row }) => {
        const { canEdit, canDelete } = getPermission('USERS', ['edit', 'delete'])

        const [isOpen, setIsOpen] = useState<boolean>(false)
        const [modalType, setModalType] = useState<'qrCode' | 'form'>('qrCode')
        const [qrCodeData, setQrCodeData] = useState<Pick<UserWithQrCode, 'username' | 'quick_response_code'> | null>(
          null
        )
        const { executeAsync } = useAction(getQrCodeUserAction, {
          onSuccess: ({ data }) => {
            setQrCodeData(
              data
                ? {
                    username: data.username,
                    quick_response_code: data.quick_response_code
                  }
                : null
            )

            setModalType('qrCode')
            setIsOpen(true)
          },
          onError: ({ error }) => {
            if (error.serverError) {
              toast.error(error.serverError)
            }
          }
        })

        return (
          <Modal type="dialog" open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex flex-1 justify-center">
              <BaseActionCell
                actions={[
                  {
                    name: 'qrCode',
                    label: 'QR Code',
                    icon: 'lucide:qr-code',
                    onClick: async () => {
                      await executeAsync({ id: row.original.id })
                    }
                  },
                  {
                    name: 'edit',
                    disable: !canEdit,
                    label: 'Edit',
                    onClick: () => {
                      setModalType('form')
                      setIsOpen(true)
                    }
                  },
                  {
                    name: 'updateStatus',
                    label: 'Ubah Status',
                    icon: 'mdi:list-status',
                    currentStatus: row.original.status,
                    onStatusUpdate: async newStatus => {
                      toast.promise(
                        updateStatusUserAction({
                          id: row.original.id,
                          status: newStatus
                        }),
                        {
                          loading: 'Mengubah status...',
                          success: result => {
                            if (result?.serverError) {
                              throw result?.serverError
                            }

                            return 'Status berhasil diubah'
                          },
                          error: 'Gagal mengubah status'
                        }
                      )
                    }
                  },
                  {
                    name: 'delete',
                    disable: !canDelete,
                    label: 'Hapus',
                    titleDialog: `Apakah Anda yakin ingin menghapus ${row.original.name}?`,
                    onDelete: () => {
                      toast.promise(
                        deleteUserAction({
                          id: row.original.id
                        }),
                        {
                          loading: 'Menghapus...',
                          success: result => {
                            if (result?.serverError) {
                              throw result?.serverError
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

              <ModalContent hideClose={modalType === 'form'}>
                <ModalHeader>
                  <ModalTitle>{modalType === 'form' ? 'Edit Pengguna' : `QR Code - ${row.original.name}`}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  {modalType === 'form' && (
                    <UserForm
                      setIsOpen={setIsOpen}
                      defaultValues={{
                        ...row.original,
                        password: '',
                        roles: row.original.roles.map(role => role.id)
                      }}
                    />
                  )}
                  {modalType === 'qrCode' && qrCodeData && <QRCodeUser data={qrCodeData} />}
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
