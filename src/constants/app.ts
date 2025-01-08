export const STATUS_OPTIONS = [
  { value: '1', label: 'Aktif', indicator: { color: 'green-500' } },
  { value: '0', label: 'Tidak Aktif', indicator: { color: 'red-500' } }
] as const

export const KIOSK_PAGES = {
  OFFICER_VERIFICATIONS_QR: {
    title: 'Verifikasi QR Code Petugas',
    url: '/kiosk/officer-verifications/qr'
  },
  OFFICER_VERIFICATIONS_PIN: {
    title: 'Verifikasi PIN',
    url: '/kiosk/officer-verifications/pin'
  },
  REGISTRATION_TYPE: {
    title: 'Pilih Jenis Layanan',
    url: '/kiosk'
  },
  SELF_GUARANTOR: {
    title: 'Pilih Penjamin Umum',
    url: '/kiosk/guarantor-types/self-guarantors'
  },
  GUARANTOR_TYPE: {
    title: 'Pilih Penjamin',
    url: '/kiosk/guarantor-types'
  },
  VISIT_TYPE: {
    title: 'Pilih Jenis Kunjungan',
    url: '/kiosk/guarantor-types/visit-types'
  },
  VERIFY_PATIENT_BPJS: {
    title: 'Verifikasi Pasien',
    url: '/kiosk/guarantor-types/visit-types/verify-patients'
  },
  VERIFY_PATIENT_SELF: {
    title: 'Verifikasi Pasien',
    url: '/kiosk/guarantor-types/self-guarantors/verify-patients'
  },
  REFERENCES: {
    title: 'Pilih Rujukan',
    url: '/kiosk/guarantor-types/visit-types/verify-patients/references'
  },
  CONTROL_PLANS: {
    title: 'Pilih Surat Kontrol',
    url: '/kiosk/guarantor-types/visit-types/verify-patients/references/control-plans'
  },
  CONFIRM_REGISTRATION_BPJS: {
    title: 'Konfirmasi Pendaftaran',
    url: '/kiosk/guarantor-types/visit-types/verify-patients/references/control-plans/paramedics/confirm-registrations'
  },
  CONFIRM_REGISTRATION_SELF: {
    title: 'Konfirmasi Pendaftaran',
    url: '/kiosk/guarantor-types/self-guarantors/verify-patients/service-units/paramedics/confirm-registrations'
  },
  SERVICE_UNITS: {
    title: 'Pilih Klinik',
    url: '/kiosk/guarantor-types/self-guarantors/verify-patients/service-units'
  },
  PARAMEDICS_SELF: {
    title: 'Pilih Dokter',
    url: '/kiosk/guarantor-types/self-guarantors/verify-patients/service-units/paramedics'
  },
  PARAMEDICS_BPJS: {
    title: 'Pilih Dokter',
    url: '/kiosk/guarantor-types/visit-types/verify-patients/references/control-plans/paramedics'
  },
  CHECKIN_APPS: {
    title: 'Pilih Aplikasi',
    url: '/kiosk/check-in-apps'
  },
  VERIFY_APPOINTMENTS: {
    title: 'Verifikasi Kode Boking',
    url: '/kiosk/check-in-apps/verify-appointments'
  },
  BARCODE_CHECK_IN: {
    title: 'Pindai QR Code',
    url: '/kiosk/check-in-apps/verify-appointments/barcode-check-in'
  },
  CONFIRM_CHECK_IN: {
    title: 'Konfirmasi Cek In',
    url: '/kiosk/check-in-apps/verify-appointments/confirm-check-in'
  }
}
