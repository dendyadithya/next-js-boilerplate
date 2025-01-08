'use client'

import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { useHasMounted } from '@/hooks/use-has-mounted'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Command as CommandPrimitive } from 'cmdk'
import { AnimatePresence, motion } from 'motion/react'
import * as React from 'react'
import Icon from '@/components/ui/icon'
import { Skeleton } from './skeleton'

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const multiComboBoxVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default: 'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary: 'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type Option = {
  label: string
  value: string
  icon?: React.ReactNode
}

/**
 * Props for MultiComboBox component
 */
interface MultiComboBoxProps extends VariantProps<typeof multiComboBoxVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: Option[]
  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: Option[]) => void

  /** Callback function triggered when the input value changes. */
  onInputChange?: (value: string) => void

  /** The input attributes to be passed to the input element. */
  input?: string

  /** The default selected values when the component mounts. */
  defaultValue?: string[]

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string

  /**
   * Flag to indicate if the component is loading.
   */
  isLoading?: boolean
  /**
   * The selected values.
   */
  value?: Option[]
}

export const MultiComboBox = React.forwardRef<HTMLDivElement, MultiComboBoxProps>(
  (
    {
      options,
      onValueChange,
      onInputChange,
      input,
      defaultValue = [],
      placeholder,
      isLoading,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const mounted = useHasMounted()
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<Option[]>(() => {
      if (value) return value
      if (defaultValue.length > 0) {
        return defaultValue
          .map(value => options.find(option => option.value === value))
          .filter((option): option is Option => option !== undefined)
      }
      return []
    })
    const [inputValue, setInputValue] = React.useState(input || '')

    React.useEffect(() => {
      if (defaultValue.length > 0) {
        const defaultOptions = defaultValue
          .map(value => options.find(option => option.value === value))
          .filter((option): option is Option => option !== undefined)
        setSelected(defaultOptions)
        onValueChange(defaultOptions)
      }
    }, [defaultValue, options, onValueChange])

    const handleUnselect = React.useCallback(
      (option: MultiComboBoxProps['options'][number]) => {
        setSelected(prev => prev.filter(s => s.value !== option.value))
        onValueChange(selected.filter(s => s.value !== option.value))
      },
      [selected, onValueChange]
    )

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected(prev => {
              const newSelected = [...prev]
              newSelected.pop()
              return newSelected
            })
          }
        }
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    }, [])

    React.useEffect(() => {
      onInputChange?.(inputValue)
    }, [inputValue, onInputChange])

    const selectables = options.filter(option => !selected.some(s => s.value === option.value))

    if (!mounted) return null

    return (
      <Command
        ref={ref}
        shouldFilter={!input}
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
        {...props}
      >
        <motion.div initial={false} animate={{ height: 'auto' }} className="relative">
          <div
            className={cn(
              'group rounded-md border border-input px-3 py-2 text-sm',
              'transition-all duration-200',
              'hover:border-ring/50',
              'outline-none focus-within:ring-2 focus-within:ring-ring/20',
              'dark:border-border/30 dark:bg-background/95',
              className
            )}
          >
            <div className="flex min-h-[20px] flex-wrap gap-1">
              {selected.map(option => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className={cn(
                    'h-7 text-sm',
                    'bg-accent/80 text-accent-foreground',
                    'dark:bg-accent/60 dark:text-accent-foreground'
                  )}
                >
                  {option.label}
                  <button
                    className={cn(
                      'ml-1 rounded-full outline-none',
                      'ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      'transition-colors hover:bg-accent-foreground/10'
                    )}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleUnselect(option)
                    }}
                    onMouseDown={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(option)}
                  >
                    <Icon icon="lucide:x" className="size-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
              <CommandPrimitive.Input
                ref={inputRef}
                value={inputValue}
                onValueChange={search => setInputValue(search)}
                onBlur={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full z-50 mt-1 w-full overflow-hidden"
              >
                <div
                  className={cn(
                    'rounded-xl bg-background shadow-lg',
                    'border border-border/50',
                    'dark:border-border/30 dark:bg-background/95'
                  )}
                >
                  <CommandList className="scrollbar-thin max-h-[300px] overflow-y-auto py-1" isLoading={isLoading}>
                    {selectables.length > 0 && !isLoading ? (
                      <CommandGroup className="px-1">
                        {selectables.map(option => (
                          <CommandItem
                            key={option.value}
                            onMouseDown={e => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                            onSelect={() => {
                              setInputValue('')
                              setSelected(prev => [...prev, option])
                              onValueChange?.([...selected, option])
                            }}
                            className={cn(
                              'relative flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5',
                              'transition-colors duration-200',
                              'hover:bg-accent/50',
                              'cursor-pointer'
                            )}
                          >
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : null}

                    {!isLoading && selectables.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2">
                        <div
                          className={cn(
                            'flex items-center justify-center gap-2 rounded-md p-2',
                            'text-sm text-muted-foreground',
                            'border border-border/50 bg-muted/30'
                          )}
                        >
                          <Icon icon="lucide:search-x" className="size-4" />
                          Tidak ada data.
                        </div>
                      </motion.div>
                    )}

                    {isLoading && (
                      <div className="p-2">
                        <Skeleton className="h-8 w-full" />
                      </div>
                    )}
                  </CommandList>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Command>
    )
  }
)

MultiComboBox.displayName = 'MultiComboBox'
