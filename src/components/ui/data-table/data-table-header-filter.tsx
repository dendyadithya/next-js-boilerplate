import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'

interface FilterItem {
  readonly label: string
  readonly value: string
  readonly icon?: string
  readonly indicator?: {
    readonly color: string
    readonly className?: string
  }
}

// Literal type untuk filter mode
type FilterMode = 'single' | 'multiple'

export interface FilterGroup<M extends FilterMode = FilterMode, ID extends string = string> {
  readonly id: ID
  readonly title: string
  readonly mode: M
  readonly items: readonly FilterItem[]
}

// Type helper untuk active filters
type InferActiveFilters<T extends readonly FilterGroup[]> = {
  [G in T[number] as G['id']]: G extends FilterGroup<'single', G['id']>
    ? string | null
    : G extends FilterGroup<'multiple', G['id']>
      ? string[]
      : never
}

interface DataTableHeaderFilterProps<T extends readonly FilterGroup[], N extends boolean | undefined> {
  title: string
  searchProps?: {
    value: string | null
    onChange: (value: string | null) => void
    placeholder?: string
  }
  filterProps?: {
    groups: T
    activeFilters: InferActiveFilters<T>
    onFilterChange: (groupId: T[number]['id'], value: N extends true ? string | null : string) => void
    getFilterLabel?: (groupId: T[number]['id'], value: string) => string
    isCanNull: N
  }
  actionButtonProps?: {
    label: string
    icon?: string
    onClick: () => void
  }
  children?: React.ReactNode
}

// Custom FilterItem component
const FilterItem = React.forwardRef<
  HTMLDivElement,
  {
    isSelected: boolean
    onSelect: () => void
    children: React.ReactNode
  }
>(({ isSelected, onSelect, children }, ref) => (
  <div
    ref={ref}
    onClick={onSelect}
    className={cn(
      'flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm',
      isSelected ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-accent',
      'transition-colors duration-200'
    )}
  >
    {children}
  </div>
))

FilterItem.displayName = 'FilterItem'

export function DataTableHeaderFilter<T extends readonly FilterGroup[], N extends boolean | undefined>({
  title,
  searchProps,
  filterProps,
  actionButtonProps,
  children
}: DataTableHeaderFilterProps<T, N>) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterSearch, setFilterSearch] = useState('')

  // Fungsi untuk filter items berdasarkan pencarian
  const getFilteredGroups = (groups: T) => {
    if (!filterSearch.trim()) return groups

    return groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          const searchTerm = filterSearch.toLowerCase()
          return item.label.toLowerCase().includes(searchTerm) || item.value.toLowerCase().includes(searchTerm)
        })
      }))
      .filter(group => group.items.length > 0)
  }

  const handleFilterSelect = (groupId: string, value: N extends true ? string | null : string) => {
    if (!filterProps) return

    const group = filterProps.groups.find(g => g.id === groupId)
    const currentValue = filterProps.activeFilters[groupId as keyof typeof filterProps.activeFilters]
    const isCanNull = filterProps.isCanNull ?? false

    // Single mode
    if (group?.mode === 'single') {
      // Jika isCanNull true dan value sama dengan current, set null
      if (isCanNull && currentValue === value) {
        filterProps.onFilterChange(groupId, null as N extends true ? string | null : string)
      }
      // Jika isCanNull false atau value berbeda, set value baru
      else {
        filterProps.onFilterChange(groupId, value)
      }
    }
    // Multiple mode
    else if (group?.mode === 'multiple') {
      const values = Array.isArray(currentValue) ? currentValue : []
      if (values.includes(value as never)) {
        const newValues = values.filter(v => v !== value)
        filterProps.onFilterChange(groupId, newValues.join(','))
      } else {
        const newValues = [...values, value]
        filterProps.onFilterChange(groupId, newValues.join(','))
      }
    }

    if (group?.mode === 'single') {
      setIsFilterOpen(false)
    }
  }

  const getDisplayLabel = (groupId: string, value: string): string => {
    if (!filterProps) return value

    if (filterProps.getFilterLabel) {
      return filterProps.getFilterLabel(groupId, value)
    }

    const group = filterProps.groups.find(g => g.id === groupId)
    const item = group?.items.find(item => item.value === value)
    return item?.label ?? value
  }

  const totalActiveFilters = filterProps
    ? Object.entries(filterProps.activeFilters).reduce((total, [, value]) => {
        if (Array.isArray(value)) {
          return total + value.length
        }
        return total + (value ? 1 : 0)
      }, 0)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 w-full space-y-2 backdrop-blur"
    >
      {/* Main Actions Row */}
      {(title || actionButtonProps || children) && (
        <>
          <div className="flex w-full items-center justify-between">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}

            <div className="flex items-center gap-2">
              {children}
              {actionButtonProps && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="sm" className="gap-2 px-4" onClick={actionButtonProps.onClick}>
                    {actionButtonProps.icon && <Icon icon={actionButtonProps.icon} className="size-4" />}
                    {actionButtonProps.label}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Search and Filters Row */}
      {(searchProps || filterProps) && (
        <div className="flex w-full items-center justify-between gap-4 pt-2">
          <div className="flex flex-1 items-center gap-2">
            {searchProps && (
              <div className="w-[280px]">
                <Input
                  placeholder={searchProps.placeholder ?? 'Cari...'}
                  leftIcon="lucide:search"
                  value={searchProps.value ?? ''}
                  onChange={e => searchProps.onChange(e.target.value || null)}
                  className="bg-muted/30 transition-all hover:bg-muted/50 focus:bg-background"
                  rightElement={
                    searchProps.value && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => searchProps.onChange(null)}
                        className="mr-2"
                      >
                        <Icon icon="lucide:x" className="size-4 text-muted-foreground" />
                      </motion.button>
                    )
                  }
                />
              </div>
            )}

            {filterProps && (
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'gap-2',
                      isFilterOpen && 'bg-accent text-accent-foreground',
                      totalActiveFilters > 0 && 'border-primary text-primary'
                    )}
                  >
                    <Icon icon="lucide:filter" className="size-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {totalActiveFilters > 0 && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {totalActiveFilters}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Filter berdasarkan..."
                      value={filterSearch}
                      onValueChange={setFilterSearch}
                    />
                    <CommandList>
                      {getFilteredGroups(filterProps.groups).map(group => (
                        <CommandGroup key={group.id} heading={group.title}>
                          {group.items.map(item => {
                            const activeFilter =
                              filterProps.activeFilters[group.id as keyof typeof filterProps.activeFilters]
                            const isSelected = Array.isArray(activeFilter)
                              ? activeFilter.includes(item.value)
                              : activeFilter === item.value
                            return (
                              <FilterItem
                                key={item.value}
                                isSelected={isSelected ?? false}
                                onSelect={() =>
                                  handleFilterSelect(group.id, item.value as N extends true ? string | null : string)
                                }
                              >
                                {item.indicator && (
                                  <div
                                    className={cn(
                                      'size-2 rounded-full',
                                      `bg-${item.indicator.color}`,
                                      item.indicator.className
                                    )}
                                  />
                                )}
                                {item.icon && <span>{item.icon}</span>}
                                <span className="flex-1">{item.label}</span>
                                {isSelected && <Icon icon="lucide:check" className="size-4 text-primary" />}
                              </FilterItem>
                            )
                          })}
                        </CommandGroup>
                      ))}
                      {getFilteredGroups(filterProps.groups).length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Tidak ada hasil yang ditemukan.
                        </div>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {filterProps && totalActiveFilters > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden items-center gap-2 md:flex"
              >
                {Object.entries(filterProps.activeFilters).map(([groupId, values]) => {
                  // Handle single mode filters
                  if (!Array.isArray(values) && values) {
                    return (
                      <motion.div
                        key={`${groupId}-${values}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 gap-2 bg-accent text-xs hover:bg-accent/80"
                          onClick={() => handleFilterSelect(groupId, values as N extends true ? string | null : string)}
                        >
                          {getDisplayLabel(groupId, values as string)}
                          <Icon icon="lucide:x" className="size-3" />
                        </Button>
                      </motion.div>
                    )
                  }

                  // Handle multiple mode filters
                  if (Array.isArray(values)) {
                    return values.map((value, index) => (
                      <motion.div
                        key={`${groupId}-${value}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 gap-2 bg-accent text-xs hover:bg-accent/80"
                          onClick={() => handleFilterSelect(groupId, value)}
                        >
                          {getDisplayLabel(groupId, value)}
                          <Icon icon="lucide:x" className="size-3" />
                        </Button>
                      </motion.div>
                    ))
                  }

                  return null
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
