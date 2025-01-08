'use client'

import { deletePermissionAction } from '@/actions/sysadmin/permission/delete-permission'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal'
import { cn } from '@/lib/utils'
import { Permission } from '@/types/sysadmin/permission'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner'
import PermissionForm from './permission-form'
import { getPermission } from '@/lib/module/admin/permission'

type PermissionWithActions = Omit<Permission, 'id'> & { permissions: { id: string; name: string }[] }

const PermissionAction = ({
  permission,
  moduleName
}: {
  permission: { id: string; name: string }
  moduleName: string
}) => {
  const { canEdit, canDelete } = getPermission('PERMISSIONS', ['edit', 'delete'])
  const [isOpen, setIsOpen] = useState(false)
  const action = permission.name.split('_')[0]

  return (
    <AlertDialog>
      <Modal type="dialog" open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="mr-2 h-fit p-0 font-normal last:mr-0" data-permission-id={permission.id}>
              {action}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <ModalTrigger asChild>
              <DropdownMenuItem disabled={!canEdit}>Edit</DropdownMenuItem>
            </ModalTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem disabled={!canDelete}>Hapus</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModalContent hideClose>
          <ModalHeader>
            <ModalTitle>Edit Hak Akses</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <PermissionForm
              setIsOpen={setIsOpen}
              defaultValues={{
                id: permission.id,
                moduleName: moduleName.split(' ').join('-').toLowerCase(),
                actionName: action
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
          <AlertDialogDescription>Tindakan ini tidak dapat dikembalikan</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ className: 'h-8', variant: 'destructive' }))}
            onClick={() => {
              toast.promise(
                deletePermissionAction({
                  id: permission.id
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
            }}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const permissionTableColumns = (): ColumnDef<PermissionWithActions>[] => [
  {
    accessorKey: 'name',
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Nama Modul" />
    },
    cell: ({ row }) => <span className="text-sm capitalize">{row.original.name}</span>,
    size: 300
  },
  {
    accessorKey: 'permissions',
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Aksi pada Modul" />
    },
    cell: ({ row }) => (
      <>
        {row.original.permissions.map((permission, index) => (
          <span key={permission.id} className="text-sm">
            <PermissionAction permission={permission} moduleName={row.original.name} />
            {index !== row.original.permissions.length - 1 && ', '}
          </span>
        ))}
      </>
    ),
    size: 300
  }
]
