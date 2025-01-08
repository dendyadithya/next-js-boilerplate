'use client'

import Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransitionRouter } from 'next-view-transitions'
import { LoginSchema, loginSchema } from '@/types/auth'
import { getSession, signIn, signOut } from 'next-auth/react'
import { toast } from 'sonner'
import { api } from '@/lib/http/fetch-api'
import { Menu } from '@/types/sysadmin/menu'
import { useMenuStore } from '@/stores/menu-store'

export default function LoginForm() {
  const router = useTransitionRouter()
  const { setMenus, getPermissionsByUserId } = useMenuStore()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  async function onSubmit(data: LoginSchema) {
    const response = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false
    })

    if (response?.error) {
      if (typeof response.error === 'string') {
        toast.error(response.error)
      }

      if (typeof response.error === 'object') {
        const error = response.error as Record<string, string[]>

        // Check for 'username' key and set error if present
        if (error['username'] && error['username'].length > 0) {
          form.setError('username', { message: error['username'].join('\n') })
        }

        // Check for 'password' key and set error if present
        if (error['password'] && error['password'].length > 0) {
          form.setError('password', { message: error['password'].join('\n') })
        }
      }

      return
    }

    try {
      const session = await getSession()
      const { data } = await api.post<Menu[]>('menu-managements/build-menu')

      if (session) {
        const { error, message } = await getPermissionsByUserId(session.id || '')
        if (error) throw new Error(message || 'Gagal mendapatkan hak akses, silahkan hubungi administrator')
      }

      if (data) {
        const filteredMenus = filterMenusByRoles(data.response.data, session?.roles || [])
        setMenus(filteredMenus)
        toast.success('Selamat datang kembali!')
        router.replace('/')
        return response
      } else {
        throw new Error('Respons menu tidak valid')
      }
    } catch {
      toast.error('Gagal memuat menu')
      // Batalkan login dan hapus token
      await signOut({ redirect: false })
      return null
    }
  }

  // Add this function to filter menus based on user roles
  function filterMenusByRoles(menus: Menu[], userRoles: string[]): Menu[] {
    return menus
      .map(menu => ({
        ...menu,
        childs: menu.childs
          .filter(child => {
            const childRoles = child.roles.split(',').map(role => role.trim())
            return childRoles.some(role => userRoles.includes(role))
          })
          .map(child => ({
            ...child,
            childs: filterMenusByRoles(child.childs, userRoles)
          }))
      }))
      .filter(menu => menu.childs.length > 0 || userRoles.includes(menu.roles))
  }

  return (
    <div className="w-full space-y-6">
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <div className="space-y-2">
                <Input
                  {...field}
                  placeholder="Username"
                  className="h-11 bg-background/50 px-4 shadow-sm backdrop-blur-sm transition-colors placeholder:text-muted-foreground/70 hover:bg-background/80 focus:bg-background"
                />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <div className="space-y-2">
                <Input
                  {...field}
                  type="password"
                  placeholder="Kata Sandi"
                  className="h-11 bg-background/50 px-4 shadow-sm backdrop-blur-sm transition-colors placeholder:text-muted-foreground/70 hover:bg-background/80 focus:bg-background"
                />
              </div>
            )}
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            className="h-11 w-full bg-primary text-base font-medium shadow-lg transition-all hover:bg-primary/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Icon icon="lucide:loader-circle" className="mr-2 size-5 animate-spin" />
                <span>Mohon tunggu...</span>
              </>
            ) : (
              <>
                <Icon icon="lucide:log-in" className="mr-2 size-5" />
                <span>Masuk</span>
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}
