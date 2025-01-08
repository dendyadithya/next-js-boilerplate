import { useHasMounted } from '@/hooks/use-has-mounted'
import { cn } from '@/lib/utils'
import { Command as CommandPrimitive } from 'cmdk'
import { motion } from 'motion/react'
import React, { forwardRef, useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Icon from '../ui/icon'
import { CommandGroup, CommandInput, CommandItem, CommandList } from './command'

export type Option = Record<'value' | 'label', string> & Record<string, string>

type ComboBoxProps = {
  options: Option[]
  emptyMessage?: string
  value?: Option | null
  defaultValue?: string
  onValueChange?: (value: Option) => void

  /** Callback function triggered when the input value changes. */
  onInputChange?: (value: string) => void

  /** The input attributes to be passed to the input element. */
  input?: string
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  onReset?: () => void
}

export const ComboBox = forwardRef<HTMLDivElement, ComboBoxProps>(
  (
    {
      options,
      placeholder,
      emptyMessage,
      value,
      defaultValue,
      onValueChange,
      input,
      onInputChange,
      disabled,
      isLoading = false,
      onReset
    },
    ref
  ) => {
    const mounted = useHasMounted()
    const inputRef = useRef<HTMLInputElement>(null)

    const [isOpen, setOpen] = useState(false)
    const [selected, setSelected] = useState<Option | undefined | null>(() => {
      if (value?.label) return value
      if (defaultValue) {
        const defaultOption = options.find(option => option.value === defaultValue)
        return defaultOption || null
      }
      return options.find(option => option.value === value?.value) || null
    })
    const [inputValue, setInputValue] = useState<string>(() => {
      if (selected?.label) return selected.label
      if (defaultValue) {
        const defaultOption = options.find(option => option.value === defaultValue)
        return defaultOption?.label || ''
      }
      return input || ''
    })

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (!input) {
          return
        }

        // Keep the options displayed when the user is typing
        if (!isOpen) {
          setOpen(true)
        }

        // This is not a default behaviour of the <input /> field
        if (event.key === 'Enter' && input.value !== '') {
          const optionToSelect = options.find(option => option.label === input.value)
          if (optionToSelect) {
            setSelected(optionToSelect)
            onValueChange?.(optionToSelect)
          }
        }

        if (event.key === 'Backspace' && input.value === '') {
          setSelected({
            value: '',
            label: ''
          })
          onValueChange?.({
            value: '',
            label: ''
          })
        }

        if (event.key === 'Escape') {
          input.blur()
        }
      },
      [isOpen, options, onValueChange]
    )

    const handleBlur = useCallback(() => {
      setOpen(false)
      setInputValue(selected?.label || '')
    }, [selected])

    const handleSelectOption = useCallback(
      (selectedOption: Option) => {
        setInputValue(selectedOption.label)

        setSelected(selectedOption)
        onValueChange?.(selectedOption)

        // This is a hack to prevent the input from being focused after the user selects an option
        // We can call this hack: "The next tick"
        setTimeout(() => {
          inputRef?.current?.blur()
        }, 0)
      },
      [onValueChange]
    )

    useEffect(() => {
      if (inputValue === value?.label) {
        onInputChange?.(inputValue)
      } else {
        onInputChange?.('')
      }
    }, [inputValue, value?.label, onInputChange])

    useEffect(() => {
      if (value?.value === '') {
        setSelected(null)
        setInputValue('')
        onReset?.()
      }
    }, [value, onReset])

    useEffect(() => {
      if (defaultValue && !selected) {
        const defaultOption = options.find(option => option.value === defaultValue)
        if (defaultOption) {
          setSelected(defaultOption)
          setInputValue(defaultOption.label)
          onValueChange?.(defaultOption)
        }
      }
    }, [defaultValue, options, selected, onValueChange])

    if (!mounted) return null

    return (
      <CommandPrimitive ref={ref} onKeyDown={handleKeyDown} shouldFilter={input ? false : true}>
        <motion.div initial={false} animate={{ height: 'auto' }} className="relative">
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={isLoading ? undefined : setInputValue}
            onBlur={handleBlur}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            iconRight="lucide:chevron-down"
            className={cn(
              'text-sm transition-all duration-200',
              'hover:border-ring/50',
              'outline-none',
              'focus:outline-none',
              'focus-visible:ring-0',
              'rounded-none',
              isOpen && 'border-ring ring-2 ring-ring/20',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          />

          <motion.div
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'hidden',
              isOpen && 'block',
              'rounded-xl bg-background shadow-lg',
              'border border-border/50',
              'dark:border-border/30 dark:bg-background/95',
              'absolute z-50 mt-1 w-full overflow-hidden'
            )}
          >
            <CommandList className="scrollbar-thin max-h-[300px] overflow-y-auto py-1" isLoading={isLoading}>
              {options.length > 0 && !isLoading ? (
                <CommandGroup className="px-1">
                  {options.map(option => {
                    const isSelected = selected?.value === option.value
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={event => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onSelect={() => handleSelectOption(isSelected ? { value: '', label: '' } : option)}
                        className={cn(
                          'relative flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5',
                          'transition-colors duration-200',
                          'hover:bg-accent/50',
                          isSelected && 'bg-accent/80'
                        )}
                      >
                        <span className={cn('flex-1 truncate', isSelected && 'font-medium')}>{option.label}</span>

                        <motion.div
                          initial={false}
                          animate={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0.8 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            'flex items-center justify-center',
                            'size-5 rounded-md',
                            isSelected ? 'bg-primary text-primary-foreground' : 'opacity-0'
                          )}
                        >
                          <Icon icon="lucide:check" className="size-3.5" />
                        </motion.div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ) : null}

              {!isLoading && options.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2">
                  <div
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-md p-4',
                      'text-sm text-muted-foreground',
                      'border border-border/50 bg-muted/30'
                    )}
                  >
                    <Icon icon="lucide:search-x" className="size-4" />
                    {emptyMessage || 'Tidak ada data.'}
                  </div>
                </motion.div>
              )}
            </CommandList>
          </motion.div>
        </motion.div>
      </CommandPrimitive>
    )
  }
)

ComboBox.displayName = 'ComboBox'
