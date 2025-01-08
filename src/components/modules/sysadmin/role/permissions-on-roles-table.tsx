import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Permission } from '@/types/sysadmin/permission'
import { useMemo } from 'react'

interface PermissionsOnRolesTableProps {
  permissions: Permission[]
}

export default function PermissionsOnRolesTable({ permissions }: PermissionsOnRolesTableProps) {
  const formattedData = useMemo(() => {
    if (!permissions) return []

    const groupedData = permissions.reduce(
      (acc: Record<string, Omit<Permission, 'id'> & { permissions: { id: string; name: string }[] }>, item) => {
        const [, module] = item.name.split('_')
        const formattedModule = module.split('-').join(' ')

        if (!acc[formattedModule]) {
          acc[formattedModule] = {
            name: formattedModule,
            permissions: []
          }
        }

        acc[formattedModule].permissions.push({ id: item.id, name: item.name })

        return acc
      },
      {}
    )

    return Object.values(groupedData)
  }, [permissions])

  return (
    <Table className="border">
      <TableHeader className="sticky top-0 z-20 bg-secondary">
        <TableRow>
          <TableHead className="border-r last:border-r-0">Modul</TableHead>
          <TableHead className="border-r last:border-r-0">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedData.length > 0 ? (
          formattedData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="border-r capitalize last:border-r-0">{item.name}</TableCell>
              <TableCell className="border-r last:border-r-0">
                {item.permissions.map(permission => permission.name.split('_')[0]).join(', ')}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-20 text-center">
              Tidak ada data.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
