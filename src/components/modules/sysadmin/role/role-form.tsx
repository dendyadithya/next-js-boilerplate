'use client'

import { createRoleAction } from '@/actions/sysadmin/role/create-role'
import { updateRoleAction } from '@/actions/sysadmin/role/update-role'
import DismissButton from '@/components/dismiss-button'
import SubmitButton from '@/components/submit-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormFooter } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { roleSchema } from '@/types/sysadmin/role'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransitionRouter } from 'next-view-transitions'
import { toast } from 'sonner'
import { z } from 'zod'
import FormValuePermissions from './form-value-permissions'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'

interface RoleFormProps {
  defaultValues?: z.infer<typeof roleSchema>
}

export default function RoleForm({ defaultValues }: RoleFormProps) {
  const router = useTransitionRouter()
  const { form, handleSubmitWithAction } = useHookFormAction(
    defaultValues?.id ? updateRoleAction : createRoleAction,
    zodResolver(roleSchema),
    {
      actionProps: {
        onSuccess({ data }) {
          router.replace('/sysadmin/roles')
          toast.success(data?.response)
        },

        onError({ error }) {
          toast.error(error.serverError)
        }
      },
      formProps: {
        defaultValues: defaultValues ?? {
          name: '',
          permissions: []
        }
      }
    }
  )

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle>{defaultValues ? 'Edit Peran' : 'Buat Peran Baru'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={handleSubmitWithAction}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="roleName">Nama Peran</Label>
                <Input id="roleName" placeholder="Masukan nama peran" {...field} className="w-full" />
              </div>
            )}
          />

          <Separator />

          <FormValuePermissions />
          <FormFooter>
            <DismissButton disabled={form.formState.isSubmitting} onClick={() => router.back()} variant="outline">
              Batal
            </DismissButton>
            <SubmitButton isLoading={form.formState.isSubmitting}>
              {defaultValues ? 'Perbarui' : 'Buat'} Peran
            </SubmitButton>
          </FormFooter>
        </Form>
      </CardContent>
    </Card>
  )
}
