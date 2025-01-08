'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function DateTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-baseline gap-1.5">
      <span>{format(time, 'HH:mm', { locale: id })}</span>
      <span className="text-sm font-medium text-white/90">{format(time, 'EEEE, dd MMM yyyy', { locale: id })}</span>
    </div>
  )
}
