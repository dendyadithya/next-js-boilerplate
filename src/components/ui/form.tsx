/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useMenuStore } from '@/stores/menu-store'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  FormProviderProps,
  useFormContext
} from 'react-hook-form'

const Form = <
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined
>({
  form,
  children,
  className,
  onSubmit
}: {
  form: Omit<FormProviderProps<TFieldValues, TContext, TTransformedValues>, 'children'>
  children: React.ReactNode
  className?: string
  onSubmit: React.FormEventHandler<HTMLFormElement>
}) => {
  return (
    <FormProvider {...form}>
      <form className={cn('space-y-6', className)} onSubmit={onSubmit}>
        {children}
      </form>
    </FormProvider>
  )
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  description,
  required,
  className,
  render,
  ...props
}: {
  label?: React.ReactNode
  description?: React.ReactNode
  required?: boolean
  className?: string
} & ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller
        {...props}
        render={field => (
          <FormItem className={className}>
            {!!label && (
              <FormLabel htmlFor={field.field.name} required={required}>
                {label}
              </FormLabel>
            )}
            <FormControl>{render(field)}</FormControl>
            {!!description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, required, ...props }, ref) => {
  const { formItemId } = useFormField()

  return <Label ref={ref} className={cn(className)} htmlFor={formItemId} isRequired={required} {...props} />
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    )
  }
)
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()

    return (
      <p ref={ref} id={formDescriptionId} className={cn('text-[0.8rem] text-muted-foreground', className)} {...props} />
    )
  }
)
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message) : children

    if (!body) {
      return null
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn('text-[0.8rem] font-medium text-destructive', className)}
        {...props}
      >
        {body}
      </p>
    )
  }
)
FormMessage.displayName = 'FormMessage'

type FormFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  isFixed?: boolean
}

const FormFooter = React.forwardRef<HTMLDivElement, FormFooterProps>(
  ({ className, isFixed = false, ...props }, ref) => {
    const { isOpen } = useMenuStore()
    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-200 ease-in-out',
          // Layout untuk buttons
          'flex items-center justify-end gap-3',
          // Conditional fixed positioning
          isFixed && [
            !isOpen ? 'lg:ml-[80px]' : 'lg:ml-[260px]',
            'border border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
            'px-6 py-4',
            'fixed bottom-0 left-0 right-0 z-50',
            'pb-safe' // Responsive padding untuk menghindari bottom navigation bar di mobile
          ],
          className
        )}
        {...props}
      />
    )
  }
)
FormFooter.displayName = 'FormFooter'

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormFooter, FormMessage, FormField }
