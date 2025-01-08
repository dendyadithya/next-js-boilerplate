/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { deleteRoleAction } from '@/actions/sysadmin/role/delete-role'
import BaseActionCell from '@/components/base-action-cell'
import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { cn } from '@/lib/utils'
import { Role } from '@/types/sysadmin/role'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { useTransitionRouter } from 'next-view-transitions'
import { getPermission } from '@/lib/module/admin/permission'

export function roleTableColumns(): ColumnDef<Role>[] {
  return [
    {
      accessorKey: 'expanded',
      header: '',
      cell: ({ row }) => {
        return (
          row.getCanExpand() && (
            <Button variant="ghost" size="icon" onClick={row.getToggleExpandedHandler()}>
              <Icon icon="lucide:chevron-right" className={cn('duration-100', row.getIsExpanded() && 'rotate-90')} />
            </Button>
          )
        )
      },
      size: 5
    },
    {
      accessorKey: 'name',
      enableHiding: false,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Nama" />
      },
      size: 300
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => {
        const { canEdit, canDelete } = getPermission('ROLES', ['edit', 'delete'])
        const router = useTransitionRouter()

        return (
          <BaseActionCell
            actions={[
              {
                name: 'edit',
                disable: !canEdit,
                label: 'Edit',
                onClick: () => router.push(`/sysadmin/roles/form-role-edit?id=${row.original.id}`)
              },
              {
                name: 'delete',
                disable: !canDelete,
                label: 'Hapus',
                titleDialog: `Apakah Anda yakin ingin menghapus ${row.original.name}?`,
                onDelete: () => {
                  toast.promise(
                    deleteRoleAction({
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
        )
      },
      size: 40
    }
  ]
}
