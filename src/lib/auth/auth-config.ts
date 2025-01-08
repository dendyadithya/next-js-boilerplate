import { LoginSchema, LoginResponse, loginSchema } from '@/types/auth'
import { RawResponse } from '@/types/fetch'
import { NextAuthOptions } from 'next-auth'
import { api } from '../http/fetch-api'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authConfig = {
  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/login'
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        username: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async credentials => {
        const validatedFields = loginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { username, password } = validatedFields.data

          const user = await api
            .post<RawResponse<LoginResponse>, LoginSchema>(
              '/authentications/login',
              {
                username,
                password
              },
              {
                requireAuth: false
              }
            )
            .then(async ({ data, error }) => {
              if (data && data.metadata.code === 200) {
                return {
                  id: data.response.user_data.id,
                  name: data.response.user_data.name,
                  email: data.response.user_data.email,
                  token: data.response.token,
                  roles: data.response.roles
                }
              } else {
                throw {
                  metadata: {
                    code: error?.code,
                    message: error?.message
                  }
                }
              }
            })
            .catch(error => {
              throw {
                message: error.metadata.message || error?.statusText
              }
            })

          return user
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name ?? ''
        token.email = user.email ?? ''
        token.token = user.token
        token.roles = user.roles
      }

      return token
    },
    async session({ token, session }) {
      if (token) {
        session.id = token.id
        session.name = token.name ?? ''
        session.email = token.email ?? ''
        session.token = token.token
        session.roles = token.roles
      }

      return session
    }
  }
} satisfies NextAuthOptions
