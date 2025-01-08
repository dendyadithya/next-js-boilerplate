import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Icon from '@/components/ui/icon'

const inputVariants = cva(
  'flex w-full rounded-lg border border-input bg-background text-foreground shadow-sm shadow-black/5 ring-offset-background transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        filled: 'bg-muted/50 border-transparent',
        outline: 'bg-transparent border-2',
        ghost: 'border-none shadow-none bg-transparent'
      },
      size: {
        default: 'h-9 px-3 py-1 text-base md:text-sm',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-11 px-4 text-lg',
        xl: 'h-14 px-6 text-xl',
        kiosk: 'h-14 px-6 text-xl text-center w-full'
      },
      state: {
        default: '',
        error: 'border-destructive/80 focus-visible:border-destructive/80 focus-visible:ring-destructive/80',
        success: 'border-success/80 focus-visible:border-success/80 focus-visible:ring-success/80',
        warning: 'border-warning/80 focus-visible:border-warning/80 focus-visible:ring-warning/80'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default'
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  errorMessage?: string
  leftIcon?: string
  rightIcon?: string
  rightElement?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, state, type, errorMessage, leftIcon, rightIcon, rightElement, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState<boolean | null>(type === 'password' ? false : null)
    const isKiosk = size === 'kiosk'

    const inputType = React.useMemo(() => {
      if (type === 'password') {
        return isVisible ? 'text' : 'password'
      }
      return type
    }, [type, isVisible])

    return (
      <div className="flex w-full flex-col gap-2">
        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                'pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-muted-foreground/80 peer-disabled:opacity-50',
                isKiosk && 'pl-4'
              )}
            >
              <Icon icon={leftIcon} className={cn('h-4 w-4', isKiosk && 'h-6 w-6')} />
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant, size, state: errorMessage ? 'error' : state }),
              leftIcon && 'pl-9',
              (rightIcon || rightElement || type === 'password') && 'pr-9',
              type === 'search' &&
                '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
              type === 'file' &&
                'p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground',
              isKiosk && [leftIcon && 'pl-12', (rightIcon || rightElement || type === 'password') && 'pr-12'],
              className
            )}
            ref={ref}
            {...props}
            onBlur={undefined}
            autoComplete="off"
            autoCorrect="off"
          />
          {(type === 'password' || type === 'text') && isVisible !== null && (
            <button
              className="absolute inset-y-0 end-0 mr-2 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              aria-label={isVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <Icon icon="lucide:eye-off" className={cn('h-4 w-4', isKiosk && 'h-6 w-6')} />
              ) : (
                <Icon icon="lucide:eye" className={cn('h-4 w-4', isKiosk && 'h-6 w-6')} />
              )}
            </button>
          )}
          {rightIcon && (
            <div
              className={cn(
                'pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-muted-foreground/80 peer-disabled:opacity-50',
                isKiosk && 'pr-4'
              )}
            >
              <Icon icon={rightIcon} className={cn('h-4 w-4', isKiosk && 'h-6 w-6')} />
            </div>
          )}
          {rightElement && (
            <div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-muted-foreground/80 peer-disabled:opacity-50',
                isKiosk && 'pr-4'
              )}
            >
              {rightElement}
            </div>
          )}
        </div>
        {errorMessage && (
          <p className={cn('text-xs text-destructive', isKiosk && 'text-sm')} role="alert" aria-live="polite">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
