'use client'

import { createUserAction } from '@/actions/sysadmin/user/create-user'
import { updateUserAction } from '@/actions/sysadmin/user/update-user'
import { Form, FormField, FormFooter } from '@/components/ui/form'
import { userSchema } from '@/types/sysadmin/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { toast } from 'sonner'
import { z } from 'zod'
import FormValueRole from './form-value-role'
import { Input } from '@/components/ui/input'
import { DEFAULT_VALUE_USER_FORM } from '@/constants/sysadmin/user'
import DismissButton from '@/components/dismiss-button'
import SubmitButton from '@/components/submit-button'

interface UserFormProps {
  setIsOpen: (open: boolean) => void
  defaultValues?: z.infer<typeof userSchema>
}

export default function UserForm({ setIsOpen, defaultValues }: UserFormProps) {
  const { form, handleSubmitWithAction } = useHookFormAction(
    defaultValues?.id ? updateUserAction : createUserAction,
    zodResolver(userSchema),
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
        defaultValues: defaultValues ?? DEFAULT_VALUE_USER_FORM
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
        name="username"
        label="Username"
        render={({ field }) => <Input placeholder="Masukan username" {...field} {...form.register('username')} />}
      />
      <FormField
        control={form.control}
        name="email"
        label="Email"
        render={({ field }) => <Input placeholder="Masukan email" {...field} {...form.register('email')} />}
      />
      {!defaultValues && (
        <FormField
          control={form.control}
          name="password"
          label="Kata Sandi"
          render={({ field }) => (
            <Input placeholder="Masukan kata sandi" {...field} type="password" {...form.register('password')} />
          )}
        />
      )}
      <FormValueRole />
      <FormFooter>
        <DismissButton onClick={() => setIsOpen(false)}>Batal</DismissButton>
        <SubmitButton isLoading={form.formState.isSubmitting}>Simpan</SubmitButton>
      </FormFooter>
    </Form>
  )
}
