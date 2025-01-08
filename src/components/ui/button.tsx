import { cn } from '@/lib/utils'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'group inline-flex items-center justify-center rounded whitespace-nowrap text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 duration-500',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        info: 'bg-info text-info-foreground shadow-sm hover:bg-info/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        shimmer:
          'bg-primary text-primary-foreground relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:bg-primary/90',
        gradient:
          'text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:bg-[length:200%_200%] hover:animate-gradient-xy shadow-sm'
      },
      size: {
        sm: 'h-10 px-3 py-1',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-9 p-2 px-3 w-fit',
        kiosk: 'h-14 w-full text-2xl font-bold'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
  hideIcon?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, rightIcon, leftIcon, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        disabled={isLoading}
        className={cn(buttonVariants({ variant, size, className }), 'relative overflow-hidden')}
        ref={ref}
        {...props}
      >
        {!isLoading && leftIcon && <span className="mr-1 w-5 transition-all duration-200">{leftIcon}</span>}
        {isLoading && (
          <span
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'transition-all duration-300',
              isLoading ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            )}
          >
            <span className="flex items-center gap-1">
              <span
                className={cn(
                  'animate-[loading_0.8s_ease-in-out_infinite] rounded-full bg-current',
                  size === 'kiosk' ? 'h-2 w-2' : 'h-1.5 w-1.5'
                )}
              />
              <span
                className={cn(
                  'animate-[loading_0.8s_ease-in-out_0.2s_infinite] rounded-full bg-current',
                  size === 'kiosk' ? 'h-2 w-2' : 'h-1.5 w-1.5'
                )}
              />
              <span
                className={cn(
                  'animate-[loading_0.8s_ease-in-out_0.4s_infinite] rounded-full bg-current',
                  size === 'kiosk' ? 'h-2 w-2' : 'h-1.5 w-1.5'
                )}
              />
            </span>
          </span>
        )}
        {isLoading ? (
          <span
            className={cn(
              'invisible',
              'transition-all duration-300',
              isLoading ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            )}
          >
            {props.children}
          </span>
        ) : (
          <Slottable>{props.children}</Slottable>
        )}
        {!isLoading && rightIcon && <span className="ml-1 w-5 transition-all duration-200">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
