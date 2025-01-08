'use client'

import { FormField, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { MultiComboBox } from '@/components/ui/multi-combo-box'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/http/fetch-api'
import { Permission } from '@/types/sysadmin/permission'
import { ProcessedModule, roleSchema } from '@/types/sysadmin/role'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function FormValuePermissions() {
  const { control, setValue, getValues, formState } = useFormContext<z.infer<typeof roleSchema>>()

  const { data, error, isPending } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      return await api.get<Permission[], { paginate: boolean; keyword: string }, true, true>('/permissions', {
        query: {
          keyword: '',
          paginate: false
        },
        throw: true
      })
    }
  })

  const processedPermissions: ProcessedModule[] = React.useMemo(() => {
    if (!data?.response?.data) return []

    const modules = new Map<string, ProcessedModule>()

    data.response.data.forEach(permission => {
      const [action, moduleName] = permission.name.split('_')
      if (!modules.has(moduleName)) {
        modules.set(moduleName, { id: permission.id, name: moduleName.replaceAll('-', ' '), actions: [] })
      }
      modules.get(moduleName)!.actions.push({ id: permission.id, name: action })
    })

    return Array.from(modules.values())
  }, [data])

  if (error) {
    toast.error(error.message, {
      id: 'query-error'
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="hidden items-center sm:flex">
        <Label className="w-1/4 text-sm">Modul</Label>
        <Label className="ml-2 flex-1 text-sm">Aksi pada modul</Label>
      </div>
      <Label className="text-sm sm:hidden">Hak Akses pada modul</Label>
      <Separator />
      {processedPermissions.length ? (
        processedPermissions.map(module => (
          <div key={module.id} className="flex flex-1 flex-col items-start gap-2 sm:flex-row sm:items-center">
            <span className="w-full text-sm capitalize sm:w-1/4">{module.name}</span>
            <div className="flex w-full flex-1 flex-wrap gap-4">
              <FormField
                control={control}
                name="permissions"
                className="flex w-full"
                render={({ field }) => {
                  const selectedActions = field.value
                    ? field.value.map(selected => module.actions.find(action => action.id === selected))
                    : []

                  return (
                    <MultiComboBox
                      onValueChange={newValues => {
                        const otherModulesPermissions = field.value.filter(
                          permission => !module.actions.some(action => action.id === permission)
                        )
                        setValue('permissions', [...otherModulesPermissions, ...newValues.map(value => value.value)], {
                          shouldValidate: true
                        })
                      }}
                      value={selectedActions
                        .filter(action => action !== undefined)
                        .map(action => ({
                          label: action!.name,
                          value: action!.id
                        }))}
                      isLoading={isPending}
                      options={module.actions.map(action => ({
                        label: action.name,
                        value: action.id
                      }))}
                    />
                  )
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-sm text-muted-foreground">Tidak ada hak akses.</span>
        </div>
      )}
      {formState.isSubmitted && (
        <FormMessage>{getValues('permissions')?.length === 0 && 'Silahkan pilih minimal 1 hak akses'}</FormMessage>
      )}
    </div>
  )
}
