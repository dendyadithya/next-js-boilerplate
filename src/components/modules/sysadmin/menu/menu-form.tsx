import { createMenuAction } from '@/actions/sysadmin/menu/create-menu'
import { updateMenuAction } from '@/actions/sysadmin/menu/update-menu'
import DismissButton from '@/components/dismiss-button'
import SubmitButton from '@/components/submit-button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormField, FormFooter } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { menuSchema } from '@/types/sysadmin/menu'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import FormValueMainMenu from './form-value-main-menu'
import FormValueRole from './form-value-role'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { DEFAULT_VALUE_MENU_FORM } from '@/constants/sysadmin/menu'

interface MenuFormProps {
  setIsOpen: (open: boolean) => void
  defaultValues?: z.infer<typeof menuSchema>
}

export default function MenuForm({ setIsOpen, defaultValues }: MenuFormProps) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    defaultValues ? updateMenuAction : createMenuAction,
    zodResolver(menuSchema),
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
        defaultValues: defaultValues
          ? {
              ...defaultValues,
              is_service_menu: defaultValues?.is_service_menu ? 1 : 0
            }
          : DEFAULT_VALUE_MENU_FORM
      }
    }
  )

  return (
    <Form form={form} onSubmit={handleSubmitWithAction}>
      <FormField
        control={form.control}
        name="name"
        label="Nama"
        render={({ field }) => <Input placeholder="Masukan nama" {...field} {...form.register('name')} />}
      />
      <FormField
        control={form.control}
        name="icon"
        label="Ikon"
        render={({ field }) => <Input placeholder="Masukan ikon" {...field} {...form.register('icon')} />}
      />
      <FormField
        control={form.control}
        name="url"
        label="URL"
        render={({ field }) => <Input placeholder="Masukan URL" {...field} {...form.register('url')} />}
      />
      <FormField
        control={form.control}
        name="is_service_menu"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              {...field}
              {...form.register('is_service_menu')}
              checked={field.value === 1}
              onCheckedChange={checked => {
                field.onChange(checked ? 1 : 0)
              }}
            />
            <Label>Menu Utama</Label>
          </div>
        )}
      />

      <FormValueMainMenu />
      <FormValueRole />

      <FormFooter>
        <DismissButton disabled={form.formState.isSubmitting} onClick={() => setIsOpen(false)}>
          Batal
        </DismissButton>
        <SubmitButton isLoading={form.formState.isSubmitting}>Simpan</SubmitButton>
      </FormFooter>
    </Form>
  )
}
