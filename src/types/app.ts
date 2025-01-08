export type RegistrationType = {
  srcImage: string
  name: string
  registrationType: 'onsite' | 'online' | 'lansia'
  link: string
  bgColor: string
  iconColor: string
  hoverColor: string
  textHoverColor: string
  description: string
}

export type GuarantorType = {
  srcImage: string
  name: string
  guarantorId: string
  link: string
  bgColor: string
  textColor: string
  themeColor: string
  description: string
}

export type VisitType = {
  srcImage: string
  name: string
  visitType: 'NEW' | 'OLD'
  link: string
  bgColor: string
  textColor: string
  description: string
}

export type CheckInApp = {
  srcImage: string
  id: 'RSC' | 'JKN'
  name: string
  link: string
  bgColor: string
  textColor: string
  gradientColor: string
  lightBgColor: string
  lightTextColor: string
  decorativeBgColor: string
  dividerColor: string
  badgeColor: string
  badgeTextColor: string
  shadowColor: string
  type: 'Internal' | 'Eksternal'
}
