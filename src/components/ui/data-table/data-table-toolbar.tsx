'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

type DataTableToolbarProps = React.HTMLAttributes<HTMLDivElement>

export function DataTableToolbar({ children, className, ...props }: DataTableToolbarProps) {
  return (
    <div
      className={cn('sticky top-[4rem] z-40 flex w-full items-center justify-between space-x-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}
