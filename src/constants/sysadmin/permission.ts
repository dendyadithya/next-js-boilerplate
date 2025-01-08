import { GeneratePermissionSchema, PermissionSchema } from '@/types/sysadmin/permission'

export const DEFAULT_VALUE_GENERATE_PERMISSION_FORM: GeneratePermissionSchema = {
  module: ''
}

export const DEFAULT_VALUE_PERMISSION_FORM: PermissionSchema = {
  moduleName: '',
  actionName: ''
}

/**
 * Permission name constants with their descriptions
 * @description Used for access control throughout the application
 */
export const PERMISSION_NAME = {
  // ADMIN
  /** Manage user accounts and their details */
  USERS: 'users',
  /** Configure global application settings */
  APP_SETTINGS: 'app-settings',
  /** Manage user roles and their permissions */
  ROLES: 'roles',
  /** Manage system permissions */
  PERMISSIONS: 'permissions',
  /** Configure menu structure and visibility */
  MENU_MANAGEMENTS: 'menu-managements',
  /** Manage user biometric data */
  USER_BIOMETRICS: 'user-biometrics',
  /** Configure registration type settings */
  SETTING_REGISTRATION_TYPES: 'setting-registration-types',
  /** Manage service unit configurations */
  SETTING_SERVICE_UNITS: 'setting-service-units',
  /** Configure guarantor settings */
  SETTING_GUARANTORS: 'setting-guarantors',
  /** Manage check-in application settings */
  SETTING_CHECK_IN_APPS: 'setting-check-in-apps',
  /** Configure allowed IP addresses */
  ALLOW_IP_ADDRESSES: 'allow-ip-addresses',

  // VCLAIM
  /** Manage VCLAIM control planning */
  VCLAIM_CONTROL_PLANNINGS: 'vclaim-control-plannings',
  /** Access VCLAIM reference data */
  VCLAIM_REFERENCES: 'vclaim-references',
  /** Manage VCLAIM SEP data */
  VCLAIM_SEPS: 'vclaim-seps',
  /** Monitor VCLAIM services */
  VCLAIM_MONITORING_SERVICES: 'vclaim-monitoring-services',
  /** Access VCLAIM ANTROL features */
  VCLAIM_ANTROL: 'vclaim-antrol',
  /** Manage VCLAIM participant references */
  VCLAIM_REFERENCE_PARTICIPANTS: 'vclaim-reference-participants',

  // AVIAT
  /** Manage patient appointments */
  AVIAT_APPOINTMENTS: 'aviat-appointments',
  /** Manage guarantor information */
  AVIAT_GUARANTORS: 'aviat-guarantors',
  /** Manage patient data */
  AVIAT_PATIENTS: 'aviat-patients',
  /** Manage paramedic information */
  AVIAT_PARAMEDICS: 'aviat-paramedics',
  /** Configure service unit settings */
  AVIAT_SERVICE_UNITS: 'aviat-service-units',

  // TRACER
  /** Manage notification settings and delivery */
  TRACER_NOTIFICATIONS: 'tracer-notifications',
  /** Manage UserDeviceMappings data */
  USER_DEVICE_MAPPINGS: 'user-device-mappings'
} as const

/**
 * Type helper for getting permission descriptions
 * @example
 * ```typescript
 * // Will show description when hovering over 'USERS'
 * const { canEdit } = getPermission('USERS', ['edit'])
 * ```
 */
export type PermissionNameType = keyof typeof PERMISSION_NAME
