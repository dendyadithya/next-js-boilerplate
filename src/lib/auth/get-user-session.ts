import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/auth-config'

export async function getUserSession() {
  const session = await getServerSession(authConfig)
  return session
}
