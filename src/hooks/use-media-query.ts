'use client'

import * as React from 'react'

type Key = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const query: { [key in Key]: string } = {
  /** Small devices (portrait tablets and large phones, 640px and up) */
  sm: '(min-width: 640px)',
  /** Medium devices (landscape tablets, 768px and up) */
  md: '(min-width: 768px)',
  /** Large devices (laptops/desktops, 1024px and up) */
  lg: '(min-width: 1024px)',
  /** Extra large devices (large laptops and desktops, 1280px and up) */
  xl: '(min-width: 1280px)',
  /** Extra extra large devices (larger laptops and desktops, 1536px and up) */
  '2xl': '(min-width: 1536px)'
}

/**
 * Hook to get the current media query value.
 * @param key - The key of the media query to use. One of :
 * - 'sm': Small devices (portrait tablets and large phones, 640px and up)
 * - 'md': Medium devices (landscape tablets, 768px and up)
 * - 'lg': Large devices (laptops/desktops, 1024px and up)
 * - 'xl': Extra large devices (large laptops and desktops, 1280px and up)
 * - '2xl': Extra extra large devices (larger laptops and desktops, 1536px and up)
 * @returns boolean
 */

export function useMediaQuery(key: Key) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query[key])
    result.addEventListener('change', onChange)
    setValue(result.matches)

    return () => result.removeEventListener('change', onChange)
  }, [key])

  return value
}
