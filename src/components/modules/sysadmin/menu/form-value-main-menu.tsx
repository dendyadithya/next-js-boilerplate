'use client'

import { ComboBox } from '@/components/ui/combo-box'
import { FormField } from '@/components/ui/form'
import { useDebounce } from '@/hooks/use-debounce'
import { api } from '@/lib/http/fetch-api'
import { Menu, menuSchema } from '@/types/sysadmin/menu'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export default function FormValueMainMenu() {
  const { control } = useFormContext<z.infer<typeof menuSchema>>()
  const [mainMenuKeyword, setMainMenuKeyword] = useState<string>('')
  const debouncedMainMenuKeyword = useDebounce(mainMenuKeyword, 500)

  const { data, isPending } = useQuery({
    queryKey: ['menus', debouncedMainMenuKeyword],
    queryFn: async () => {
      return await api.get<Menu[], { paginate: boolean; keyword: string }, true, true>('/menu-managements', {
        query: {
          keyword: debouncedMainMenuKeyword,
          paginate: false
        },
        throw: true
      })
    }
  })

  const options =
    data?.response?.data?.map(menu => ({
      value: menu.id,
      label: menu.name
    })) || []

  return (
    <FormField
      control={control}
      name="parent_id"
      label="Anak dari Menu Utama"
      render={({ field }) => {
        const selectedOption = field.value ? options.find(opt => opt.value === field.value) : null

        return (
          <ComboBox
            placeholder="Pilih menu utama"
            defaultValue={selectedOption?.value}
            value={selectedOption || null}
            onValueChange={value => field.onChange(value.value)}
            onInputChange={setMainMenuKeyword}
            input={mainMenuKeyword}
            options={options}
            isLoading={isPending}
          />
        )
      }}
    />
  )
}
