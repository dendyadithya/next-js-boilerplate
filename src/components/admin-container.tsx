import { cn } from '@/lib/utils'
import React from 'react'

interface AdminContainerProps extends React.PropsWithChildren {
  className?: string
}

export default function AdminContainer({ children, className }: AdminContainerProps) {
  return <div className={cn('min-h-[calc(100vh-160px)] flex-1 p-4', className)}>{children}</div>
}
