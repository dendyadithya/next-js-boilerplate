'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { flexRender, Row, RowData, type Table as TanstackTable } from '@tanstack/react-table'
import React from 'react'
import { DataTableColumnResizer } from './data-table-column-resizer'
import { DataTablePagination } from './data-table-pagination'
import { getCommonPinningStyles } from './data-table-pinning'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    pin?: 'left' | 'right'
    canResize?: boolean
  }
}

interface DataTableProps<TData> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null
  renderSubRow?: (row: Row<TData>) => React.ReactNode
}

export function DataTable<TData>({ table, floatingBar = null, renderSubRow }: DataTableProps<TData>) {
  React.useEffect(() => {
    table.getCoreRowModel().rows.forEach(row => {
      row.getVisibleCells().forEach(cell => {
        if (cell.column.columnDef.meta?.pin) {
          cell.column.pin(cell.column.columnDef.meta.pin)
        }
      })
    })
  }, [table])

  const isPaginate = table.options.pageCount !== -1

  return (
    <>
      <div
        className={cn(
          'relative flex-1 overflow-auto rounded-md border',
          isPaginate ? 'max-h-[calc(100vh-16rem)]' : 'max-h-[calc(100vh-13rem)]'
        )}
      >
        <Table style={{ width: table.getTotalSize(), minWidth: '100%' }}>
          <TableHeader className="sticky top-0 z-20 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'group relative border-r last:border-r-0 dark:border-primary-foreground',
                        header.column.columnDef.meta?.pin && 'bg-secondary',
                        header.column.getIsResizing() &&
                          'border-r-4 border-blue-500 transition-colors duration-200 ease-in-out dark:border-blue-500'
                      )}
                      style={{
                        position: 'sticky',
                        top: 0,
                        minWidth: header.column.columnDef.size,
                        maxWidth: header.column.columnDef.size,
                        ...getCommonPinningStyles(header.column)
                      }}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      <DataTableColumnResizer header={header} />
                      {header.column.getIsResizing() && (
                        <div className="absolute inset-0 z-20 bg-blue-200 opacity-20 transition-opacity duration-200 dark:bg-blue-900" />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        className={cn(
                          'border-r last:border-r-0',
                          cell.column.columnDef.meta?.pin && 'bg-zinc-50 dark:bg-zinc-900',
                          cell.column.getIsResizing() &&
                            'border-r-4 border-blue-500 transition-colors duration-200 ease-in-out'
                        )}
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          ...getCommonPinningStyles(cell.column)
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        {cell.column.getIsResizing() && (
                          <div className="absolute inset-0 bg-blue-200 opacity-20 transition-opacity duration-200 dark:bg-blue-900" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && renderSubRow && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="ml-6">{renderSubRow(row)}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() >= 1 && (
        <div className="mt-2 flex flex-col gap-2.5">
          <DataTablePagination table={table} />
          {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
        </div>
      )}
    </>
  )
}
