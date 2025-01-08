'use client'

import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'
import { Input } from './input'

interface ColorPickerProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
}

export function ColorPicker({ value = '#000000', onChange, className, placeholder }: ColorPickerProps) {
  const [color, setColor] = useState(value)

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onChange?.(newColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-2">
          <div
            className={cn(
              'h-10 w-10 cursor-pointer rounded-md border border-input',
              'hover:border-primary/50 hover:shadow-sm',
              className
            )}
            style={{ backgroundColor: color }}
          />
          <Input
            value={color}
            onChange={e => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <HexColorPicker color={color} onChange={handleChange} />
      </PopoverContent>
    </Popover>
  )
}
