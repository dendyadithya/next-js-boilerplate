'use client'

import { FormField } from '@/components/ui/form'
import { MultiComboBox } from '@/components/ui/multi-combo-box'
import { useDebounce } from '@/hooks/use-debounce'
import { api } from '@/lib/http/fetch-api'
import { menuSchema } from '@/types/sysadmin/menu'
import { Role } from '@/types/sysadmin/role'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function FormValueRole() {
  const { control } = useFormContext<z.infer<typeof menuSchema>>()
  const [roleKeyword, setRoleKeyword] = useState<string>('')
  const debouncedRoleKeyword = useDebounce(roleKeyword, 500)

  const { data, error, isPending } = useQuery({
    queryKey: ['roles', debouncedRoleKeyword],
    queryFn: async () => {
      return await api.get<Role[], { paginate: boolean; keyword: string }, true, true>('/roles', {
        query: {
          keyword: '',
          paginate: false
        },
        throw: true
      })
    }
  })

  if (error) {
    toast.error(error.message, {
      id: 'query-error'
    })
  }

  return (
    <FormField
      control={control}
      name="roles"
      label="Peran"
      render={({ field }) => (
        <MultiComboBox
          placeholder="Pilih peran"
          onValueChange={value => {
            const roles = value.map(role => role.value).join(',')
            field.onChange(roles)
          }}
          onInputChange={value => setRoleKeyword(value)}
          input={roleKeyword}
          value={
            field.value.includes(',')
              ? field.value.split(',').map(role => ({ value: role, label: role }))
              : field.value
                ? [{ value: field.value, label: field.value }]
                : []
          }
          isLoading={isPending}
          options={data?.response?.data.map(role => ({ value: role.name, label: role.name })) || []}
        />
      )}
    />
  )
}
