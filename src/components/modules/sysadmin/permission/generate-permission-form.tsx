import { generatePermissionAction } from '@/actions/sysadmin/permission/generate-permission'
import DismissButton from '@/components/dismiss-button'
import SubmitButton from '@/components/submit-button'
import { Form, FormField, FormFooter } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DEFAULT_VALUE_GENERATE_PERMISSION_FORM } from '@/constants/sysadmin/permission'
import { generatePermissionSchema } from '@/types/sysadmin/permission'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { toast } from 'sonner'

interface GeneratePermissionFormProps {
  setIsOpen: (open: boolean) => void
}

export default function GeneratePermissionForm({ setIsOpen }: GeneratePermissionFormProps) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    generatePermissionAction,
    zodResolver(generatePermissionSchema),
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
        defaultValues: DEFAULT_VALUE_GENERATE_PERMISSION_FORM
      }
    }
  )

  return (
    <Form form={form} onSubmit={handleSubmitWithAction}>
      <FormField
        control={form.control}
        name="module"
        label="Nama Modul"
        render={({ field }) => <Input placeholder="Masukan nama modul" {...field} {...form.register('module')} />}
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
