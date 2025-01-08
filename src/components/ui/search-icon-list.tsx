'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { SearchBox, type SearchOption } from '@/components/ui/search-box'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'

interface IconifyResponse {
  icons: string[]
  total: number
}

interface SearchIconListProps {
  value?: SearchOption | null
  onValueChange?: (value: SearchOption) => void
  placeholder?: string
}

export default function SearchIconList({ value, onValueChange, placeholder = 'Cari icon...' }: SearchIconListProps) {
  const [searchTerm, setSearchTerm] = useState(value?.label || '')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const {
    data: iconData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['icons', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return { icons: [], total: 0 }

      const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(debouncedSearch)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch icon data')
      }

      const data = await response.json()
      return data as IconifyResponse
    },
    enabled: debouncedSearch.length >= 2
  })

  const options: SearchOption[] = (iconData?.icons || []).map(icon => ({
    value: icon,
    label: icon,
    icon
  }))

  if (error) {
    toast.error('Gagal mengambil data ikon')
  }

  return (
    <SearchBox
      value={value}
      options={options}
      onValueChange={onValueChange}
      onInputChange={setSearchTerm}
      input={searchTerm}
      isLoading={isLoading}
      placeholder={placeholder}
      emptyMessage="Ketik minimal 2 karakter untuk mencari"
    />
  )
}
