'use client'

import { Command as CommandPrimitive } from 'cmdk'
import { motion } from 'motion/react'
import React, { forwardRef, useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import Icon from '@/components/ui/icon'
import { CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { useHasMounted } from '@/hooks/use-has-mounted'

export type SearchOption = {
  value: string
  label: string
  icon: string
}

interface SearchBoxProps {
  options: SearchOption[]
  value?: SearchOption | null
  onValueChange?: (value: SearchOption) => void
  onInputChange?: (value: string) => void
  input?: string
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  emptyMessage?: string
}

export const SearchBox = forwardRef<HTMLDivElement, SearchBoxProps>(
  (
    {
      options,
      value,
      onValueChange,
      input,
      onInputChange,
      isLoading,
      disabled,
      placeholder = 'Cari...',
      emptyMessage = 'Tidak ada data.'
    },
    ref
  ) => {
    const mounted = useHasMounted()
    const inputRef = useRef<HTMLInputElement>(null)
    const [isOpen, setOpen] = useState(false)
    const [selected, setSelected] = useState<SearchOption | null>(value || null)
    const [inputValue, setInputValue] = useState<string>(input || '')

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (!input) return

        if (!isOpen) setOpen(true)

        if (event.key === 'Backspace' && input.value === '' && selected) {
          setSelected(null)
          setInputValue('')
          onValueChange?.({ value: '', label: '', icon: '' })
        }

        if (event.key === 'Enter' && input.value !== '') {
          const optionToSelect = options.find(option => option.label === input.value)
          if (optionToSelect) {
            setSelected(optionToSelect)
            onValueChange?.(optionToSelect)
          }
        }

        if (event.key === 'Escape') {
          input.blur()
        }
      },
      [isOpen, options, onValueChange, selected]
    )

    const handleBlur = useCallback(() => {
      setOpen(false)
      if (inputValue && !selected) return
      if (!inputValue && !selected) return
      setInputValue(selected?.label || '')
    }, [selected, inputValue])

    const handleSelectOption = useCallback(
      (selectedOption: SearchOption) => {
        setInputValue(selectedOption.label)
        setSelected(selectedOption)
        onValueChange?.(selectedOption)
        setTimeout(() => {
          inputRef?.current?.blur()
        }, 0)
      },
      [onValueChange]
    )

    const handleInputChange = (value: string) => {
      setInputValue(value)
      if (value === '' && selected) {
        setSelected(null)
        onValueChange?.({ value: '', label: '', icon: '' })
      }
      onInputChange?.(value)
    }

    if (!mounted) return null

    return (
      <CommandPrimitive ref={ref} onKeyDown={handleKeyDown} shouldFilter={false}>
        <motion.div initial={false} animate={{ height: 'auto' }} className="relative">
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={isLoading ? undefined : handleInputChange}
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
              'absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md'
            )}
          >
            <CommandList className="max-h-[300px] overflow-y-auto p-1">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Icon icon="lucide:loader-2" className="size-5 animate-spin" />
                </div>
              ) : options.length > 0 ? (
                <CommandGroup>
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
                        onSelect={() => handleSelectOption(option)}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
                          'hover:bg-accent hover:text-accent-foreground',
                          isSelected && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <Icon icon={option.icon} className="size-5" />
                        <span className="flex-1">{option.label}</span>
                        {isSelected && <Icon icon="lucide:check" className="size-4" />}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ) : (
                <div className="p-2">
                  <div className="flex items-center justify-center gap-2 rounded-sm bg-muted/50 p-4 text-sm text-muted-foreground">
                    <Icon icon="lucide:search-x" className="size-4" />
                    {emptyMessage}
                  </div>
                </div>
              )}
            </CommandList>
          </motion.div>
        </motion.div>
      </CommandPrimitive>
    )
  }
)

SearchBox.displayName = 'SearchBox'
