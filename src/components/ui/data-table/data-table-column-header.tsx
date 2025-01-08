import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type Column } from '@tanstack/react-table'
import { motion } from 'motion/react'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn('ml-2 font-medium', className)}>{title}</div>
  }

  return (
    <div className={cn('group flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-full justify-between gap-2 px-3',
              'bg-transparent hover:bg-accent/50',
              'data-[state=open]:bg-accent',
              'transition-all duration-200',
              'group/button'
            )}
          >
            <span className="font-medium">{title}</span>
            <motion.div animate={{ rotate: column.getIsSorted() ? 0 : 180 }} transition={{ duration: 0.2 }}>
              {column.getCanSort() && (
                <motion.div
                  animate={{
                    rotate: column.getIsSorted() === 'desc' ? 180 : 0,
                    scale: column.getIsSorted() ? 1 : 0.8
                  }}
                >
                  {column.getIsSorted() ? (
                    <Icon
                      icon={column.getIsSorted() === 'desc' ? 'lucide:arrow-down' : 'lucide:arrow-up'}
                      className="h-4 w-4 text-primary"
                    />
                  ) : (
                    <Icon
                      icon="lucide:arrow-up-down"
                      className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover/button:opacity-100"
                    />
                  )}
                </motion.div>
              )}
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                className="flex items-center gap-2 transition-colors"
                onClick={() => column.toggleSorting(false)}
              >
                <Icon icon="lucide:arrow-up" className="h-4 w-4" />
                <span>Ascending</span>
                {column.getIsSorted() === 'asc' && <Icon icon="lucide:check" className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => column.toggleSorting(true)}>
                <Icon icon="lucide:arrow-down" className="h-4 w-4" />
                <span>Descending</span>
                {column.getIsSorted() === 'desc' && <Icon icon="lucide:check" className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </>
          )}
          {column.getCanHide() && (
            <>
              {column.getCanSort() && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className="flex items-center gap-2 text-destructive focus:text-destructive"
                onClick={() => column.toggleVisibility(false)}
              >
                <Icon icon="lucide:eye-off" className="h-4 w-4" />
                <span>Hide Column</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
