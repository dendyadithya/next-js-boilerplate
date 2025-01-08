import Icon from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { Header } from '@tanstack/react-table'
import { Button } from '../button'

export function DataTableColumnResizer<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.columnDef.meta?.canResize) return <></>

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn(
        'absolute flex h-fit w-fit cursor-grabbing items-center justify-end p-1',
        '-right-2 top-[50%] -translate-y-1/2',
        'z-50 hover:bg-accent',
        'border border-border/50 shadow-sm',
        'opacity-0 transition-opacity duration-200 group-hover:opacity-100'
      )}
      onDoubleClick={() => header.column.resetSize()}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      style={{
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      <Icon icon="radix-icons:drag-handle-dots-2" className="size-3.5" />
    </Button>
  )
}
