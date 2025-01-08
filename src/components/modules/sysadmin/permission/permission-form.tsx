import { createPermissionAction } from '@/actions/sysadmin/permission/create-permission'
import { updatePermissionAction } from '@/actions/sysadmin/permission/update-permission'
import DismissButton from '@/components/dismiss-button'
import SubmitButton from '@/components/submit-button'
import { Form, FormField, FormFooter } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DEFAULT_VALUE_PERMISSION_FORM } from '@/constants/sysadmin/permission'
import { permissionSchema } from '@/types/sysadmin/permission'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { toast } from 'sonner'
import { z } from 'zod'

interface PermissionFormProps {
  setIsOpen: (open: boolean) => void
  defaultValues?: z.infer<typeof permissionSchema>
}

export default function PermissionForm({ setIsOpen, defaultValues }: PermissionFormProps) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    defaultValues ? updatePermissionAction : createPermissionAction,
    zodResolver(permissionSchema),
    {
      actionProps: {
        onSuccess({ data }) {
          setIsOpen(false)
          toast.success(data?.response)
        },

        onError({ error }) {
          toast.error(error.serverError)
        }
      },
      formProps: {
        defaultValues: defaultValues ?? DEFAULT_VALUE_PERMISSION_FORM
      }
    }
  )

  return (
    <Form form={form} onSubmit={handleSubmitWithAction}>
      <FormField
        control={form.control}
        name="moduleName"
        label="Nama Modul"
        render={({ field }) => <Input placeholder="Masukan nama modul" {...field} {...form.register('moduleName')} />}
      />
      <FormField
        control={form.control}
        name="actionName"
        label="Nama Aksi"
        render={({ field }) => <Input placeholder="Masukan nama aksi" {...field} {...form.register('actionName')} />}
      />
      <FormFooter>
        <DismissButton disabled={form.formState.isSubmitting} onClick={() => setIsOpen(false)}>
          Batal
        </DismissButton>
        <SubmitButton isLoading={form.formState.isSubmitting}>Simpan</SubmitButton>
      </FormFooter>
    </Form>
  )
}
