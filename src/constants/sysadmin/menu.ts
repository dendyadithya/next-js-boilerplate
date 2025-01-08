import { MenuSchema } from '@/types/sysadmin/menu'

export const DEFAULT_VALUE_MENU_FORM: MenuSchema = {
  icon: '',
  name: '',
  url: '',
  roles: '',
  is_service_menu: 0,
  parent_id: null
}
