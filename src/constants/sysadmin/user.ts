import { UserSchema } from '@/types/sysadmin/user'

export const DEFAULT_VALUE_USER_FORM: UserSchema = {
  name: '',
  username: '',
  email: '',
  roles: [],
  password: '',
  status: 1
}
