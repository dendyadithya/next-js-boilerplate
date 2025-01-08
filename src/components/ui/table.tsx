'use client'

import { cn } from '@/lib/utils'
import { HTMLMotionProps, motion } from 'motion/react'
import * as React from 'react'

type TableProps = React.HTMLAttributes<HTMLTableElement>
type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>
type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>
type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>
type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>
type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>
type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="w-full">
    <motion.table
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('w-full border-separate border-spacing-0 text-sm', className)}
      {...(props as HTMLMotionProps<'table'>)}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'sticky top-0 z-20',
      'border-b bg-muted/50',
      '[&_tr]:border-b-0',
      'transition-colors duration-200',
      className
    )}
    style={{ position: 'sticky', top: 0 }}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      '[&_tr:last-child]:border-0',
      '[&_tr:hover]:bg-muted/50',
      'transition-colors duration-200',
      className
    )}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <motion.tr
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className={cn(
      'h-11 border-b',
      'transition-all duration-200 ease-in-out',
      'hover:bg-muted/50',
      'data-[state=selected]:bg-muted',
      className
    )}
    {...(props as HTMLMotionProps<'tr'>)}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-11 px-2 text-left align-middle font-medium',
      'text-muted-foreground',
      'border-r border-border last:border-r-0',
      'transition-colors duration-200',
      '[&:has([role=checkbox])]:pr-0',
      'bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'px-4 py-1 align-middle',
      'border-r border-border last:border-r-0',
      'transition-colors duration-200',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
))
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
