import { cn } from '@/lib/utils'
import { Icon as Iconify, IconProps } from '@iconify/react'

export default function Icon(props: IconProps) {
  return <Iconify {...props} icon={props.icon} className={cn('size-4', props.className)} />
}
