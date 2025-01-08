'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { Minus } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputOTPVariants = cva(
  'relative flex items-center justify-center border-y border-r border-input shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
  {
    variants: {
      variant: {
        default: 'h-9 w-9 text-sm',
        kiosk: 'h-12 w-12 text-xl font-semibold sm:h-14 sm:w-14 sm:text-2xl'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
)
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center', className)} {...props} />
)
InputOTPGroup.displayName = 'InputOTPGroup'

interface InputOTPSlotProps extends React.ComponentPropsWithoutRef<'div'>, VariantProps<typeof inputOTPVariants> {
  index: number
}

const InputOTPSlot = React.forwardRef<React.ElementRef<'div'>, InputOTPSlotProps>(
  ({ index, variant, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext)
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

    return (
      <div
        ref={ref}
        className={cn(
          inputOTPVariants({ variant }),
          '"relative last:rounded-r-md" flex items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l',
          isActive && 'z-10 ring-2 ring-ring',
          className
        )}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                'animate-caret-blink bg-foreground duration-1000',
                variant === 'kiosk' ? 'h-6 w-px' : 'h-4 w-px'
              )}
            />
          </div>
        )}
      </div>
    )
  }
)
InputOTPSlot.displayName = 'InputOTPSlot'

const InputOTPSeparator = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
  ({ ...props }, ref) => (
    <div ref={ref} role="separator" className="text-muted-foreground" {...props}>
      <Minus className="h-4 w-4 sm:h-6 sm:w-6" />
    </div>
  )
)
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
