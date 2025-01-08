import AdminContainer from '@/components/admin-container'
import LoadingRoleForm from '@/components/modules/sysadmin/role/loading-role-form'
import RoleForm from '@/components/modules/sysadmin/role/role-form'
import { api } from '@/lib/http/fetch-api'
import { Role } from '@/types/sysadmin/role'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface RoleFormPageProps {
  searchParams: Promise<{
    id: string
  }>
  params: Promise<{
    'role-form': string
  }>
}

export async function generateMetadata({ params }: RoleFormPageProps) {
  const parsedParams = await params

  return {
    title: parsedParams['role-form'] === 'form-role-edit' ? 'Edit Peran' : 'Tambah Peran'
  }
}

export default async function RoleFormPage({ searchParams, params }: RoleFormPageProps) {
  const { id } = await searchParams
  const parsedParams = await params

  if (parsedParams['role-form'] === 'form-role-edit') {
    const data = await api.get<Role, never, false, true>(`roles/${id}`, {
      throw: true
    })

    return (
      <AdminContainer>
        <>
          <Suspense fallback={<LoadingRoleForm />}>
            <RoleForm
              defaultValues={{
                id: data.response?.data?.id,
                name: data.response?.data?.name || '',
                permissions: data.response?.data?.permission.map(permission => permission.id) || []
              }}
            />
          </Suspense>
        </>
      </AdminContainer>
    )
  } else if (parsedParams['role-form'] === 'form-role-create') {
    return (
      <AdminContainer>
        <>
          <Suspense fallback={<LoadingRoleForm />}>
            <RoleForm />
          </Suspense>
        </>
      </AdminContainer>
    )
  }

  return notFound()
}
