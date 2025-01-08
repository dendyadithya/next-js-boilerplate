import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { type Table } from '@tanstack/react-table'
import { motion } from 'motion/react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50]
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const totalRows = table.getRowCount()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      {/* Left Section - Total Data */}
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-muted/50 px-3 py-1">
          <span className="text-sm font-medium text-foreground">{totalRows}</span>
          <span className="ml-1.5 text-sm text-muted-foreground">Total Data</span>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-3">
        {/* Current View Info */}
        {/* <div className="hidden text-sm text-muted-foreground sm:block">
          Menampilkan baris {startRow} sampai {endRow}
        </div> */}

        {/* Page Size Selector */}
        <div className="flex items-center rounded-lg border bg-background shadow-sm">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => table.setPageSize(Number(value))}
          >
            <SelectTrigger
              className={cn(
                'h-8 w-[5rem] border-none bg-transparent',
                'flex items-center justify-between px-3',
                '[&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1.5',
                '[&>svg]:size-4 [&>svg]:shrink-0'
              )}
            >
              <div className="flex items-center">
                <span className="text-sm">{table.getState().pagination.pageSize}</span>
              </div>
            </SelectTrigger>
            <SelectContent align="end" className="min-w-[5rem] max-w-[5rem]">
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={`${size}`} className="text-sm">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center overflow-hidden rounded-lg border bg-background shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border-r"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="Halaman Pertama"
          >
            <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}>
              <Icon icon="lucide:chevrons-left" className="size-4" />
            </motion.div>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border-r"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Halaman Sebelumnya"
          >
            <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}>
              <Icon icon="lucide:chevron-left" className="size-4" />
            </motion.div>
          </Button>

          <div className="flex h-8 min-w-[3rem] items-center justify-center border-r px-3">
            <span className="text-sm font-medium">{currentPage}</span>
            <span className="mx-1 text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{totalPages}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border-r"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Halaman Berikutnya"
          >
            <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.95 }}>
              <Icon icon="lucide:chevron-right" className="size-4" />
            </motion.div>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            title="Halaman Terakhir"
          >
            <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.95 }}>
              <Icon icon="lucide:chevrons-right" className="size-4" />
            </motion.div>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
