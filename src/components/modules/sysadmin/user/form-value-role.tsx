'use client'

import { FormField } from '@/components/ui/form'
import { MultiComboBox } from '@/components/ui/multi-combo-box'
import { useDebounce } from '@/hooks/use-debounce'
import { api } from '@/lib/http/fetch-api'
import { Role } from '@/types/sysadmin/role'
import { userSchema } from '@/types/sysadmin/user'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

export default function FormValueRole() {
  const { control } = useFormContext<z.infer<typeof userSchema>>()
  const [roleKeyword, setRoleKeyword] = useState<string>('')
  const debouncedRoleKeyword = useDebounce(roleKeyword, 500)

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const { data, error } = await api.get<Role[], { keyword: string }>('roles', {
        query: { keyword: debouncedRoleKeyword }
      })

      if (error) {
        throw error
      }

      return data
    },
    queryKey: ['getAllRole', JSON.stringify(debouncedRoleKeyword)],
    throwOnError: true
  })

  return (
    <FormField
      control={control}
      name="roles"
      label="Peran"
      render={({ field }) => {
        return (
          <MultiComboBox
            placeholder="Pilih peran"
            onValueChange={value => field.onChange(value.map(value => value.value))}
            onInputChange={value => setRoleKeyword(value)}
            input={roleKeyword}
            defaultValue={field.value}
            value={field.value ? field.value.map(value => ({ value, label: '' })) : []}
            isLoading={isLoading}
            options={data?.response?.data.map(role => ({ value: role.id, label: role.name })) || []}
          />
        )
      }}
    />
  )
}
