import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 break-words whitespace-normal',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',

        // Modern solid variants
        info: 'border-transparent bg-blue-500 text-white shadow-sm hover:bg-blue-600',
        success: 'border-transparent bg-green-500 text-white shadow-sm hover:bg-green-600',
        warning: 'border-transparent bg-yellow-500 text-white shadow-sm hover:bg-yellow-600',
        error: 'border-transparent bg-red-500 text-white shadow-sm hover:bg-red-600',

        // Soft/Pastel variants
        'soft-primary': 'bg-primary/10 text-primary hover:bg-primary/20',
        'soft-info': 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-100',
        'soft-success': 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 hover:bg-green-100',
        'soft-warning': 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 hover:bg-yellow-100',
        'soft-error': 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100',

        // Outline variants
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        'outline-primary': 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
        'outline-info': 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
        'outline-success': 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
        'outline-warning': 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white',
        'outline-error': 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',

        // Special variants
        premium: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm',
        glass: 'backdrop-blur-sm bg-white/10 border border-white/20 shadow-sm text-white',
        dot: 'pl-1.5' // For badges with dots
      },
      size: {
        default: 'min-h-[24px]',
        sm: 'min-h-[20px] px-2 text-[10px]',
        lg: 'min-h-[28px] px-3 text-sm'
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        sm: 'rounded-sm'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default'
    }
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  withDot?: boolean
  dotColor?: string
}

function Badge({
  className,
  variant,
  size,
  rounded,
  withDot,
  dotColor = 'currentColor',
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, rounded }), className)} {...props}>
      {withDot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dotColor }} />}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
