import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string({ required_error: 'Username wajib diisi' }).min(1, { message: 'Username wajib diisi' }),
  password: z.string({ required_error: 'Password wajib diisi' }).min(1, { message: 'Password wajib diisi' })
})
export type LoginSchema = z.infer<typeof loginSchema>

export interface LoginResponse {
  lastLoginFrom: string
  token: string
  user_data: {
    id: string
    name: string
    email: string
  }
  roles: string[]
  __raw: true
}
