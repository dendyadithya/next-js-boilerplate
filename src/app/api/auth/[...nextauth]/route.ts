/* eslint-disable @typescript-eslint/no-empty-object-type */
import NextAuth from 'next-auth/next'
import { User as CurrentUser } from '@/types/sysadmin/user'
import { authConfig } from '@/lib/auth/auth-config'

interface AuthResponse extends Pick<CurrentUser, 'id' | 'name' | 'email'> {
  token: string
  roles: string[]
}

declare module 'next-auth' {
  interface Session extends AuthResponse {}

  interface User extends AuthResponse {}
}

declare module 'next-auth/jwt' {
  interface JWT extends AuthResponse {}
}

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
