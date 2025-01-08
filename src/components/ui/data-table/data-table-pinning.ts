import { Column } from '@tanstack/react-table'
import { CSSProperties } from 'react'

export const getCommonPinningStyles = <T>(column: Column<T>): CSSProperties => {
  const isPinned = column.columnDef.meta?.pin
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '4px 0 8px -6px rgb(0 0 0 / 0.1)' // Softer, modern shadow
      : isFirstRightPinnedColumn
        ? '-4px 0 8px -6px rgb(0 0 0 / 0.1)' // Softer, modern shadow
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned && 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    borderRight: isPinned
      ? '1px solid rgb(229 231 235)' // Subtle modern border color (gray-200)
      : undefined
  }
}
