/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback } from 'react'
import { useUnmount } from './use-un-mounted'

type DebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

type ControlFunctions = {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export type DebouncedState<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions

export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay = 500,
  options: DebounceOptions = {}
): DebouncedState<T> {
  const { leading = false, trailing = true, maxWait } = options

  // Refs untuk menyimpan state
  const timeoutRef = useRef<NodeJS.Timeout>()
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout>()
  const lastCallTimeRef = useRef<number>(0)
  const lastInvokeTimeRef = useRef<number>(0)
  const lastArgsRef = useRef<any[]>()
  const lastThisRef = useRef<any>()
  const isPendingRef = useRef(false)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current)
      maxWaitTimeoutRef.current = undefined
    }
    lastInvokeTimeRef.current = 0
    lastCallTimeRef.current = 0
    lastArgsRef.current = undefined
    lastThisRef.current = undefined
    isPendingRef.current = false
  }, [])

  // Invoke function
  const invoke = useCallback(
    (time: number) => {
      const args = lastArgsRef.current
      const thisArg = lastThisRef.current

      lastInvokeTimeRef.current = time
      lastArgsRef.current = undefined
      lastThisRef.current = undefined
      isPendingRef.current = false

      if (args) {
        return callback.apply(thisArg, args)
      }
    },
    [callback]
  )

  // Main debounced function
  const debounced = useCallback(
    (...args: Parameters<T>) => {
      const time = Date.now()
      const isInvoking = shouldInvoke(time)
      lastArgsRef.current = args
      lastThisRef.current = undefined // Remove 'this' since it's not needed in arrow functions
      lastCallTimeRef.current = time
      isPendingRef.current = true

      if (isInvoking && leading) {
        return invoke(time)
      }

      if (maxWait !== undefined && !maxWaitTimeoutRef.current) {
        maxWaitTimeoutRef.current = setTimeout(() => {
          const time = Date.now()
          if (shouldInvoke(time)) {
            invoke(time)
          }
        }, maxWait)
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        const time = Date.now()
        if (trailing && shouldInvoke(time)) {
          invoke(time)
        }
        cleanup()
      }, delay)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delay, leading, trailing, maxWait, invoke, cleanup]
  ) as DebouncedState<T>

  // Helper function untuk menentukan apakah harus invoke
  const shouldInvoke = useCallback(
    (time: number) => {
      const timeSinceLastCall = time - lastCallTimeRef.current
      const timeSinceLastInvoke = time - lastInvokeTimeRef.current

      return (
        lastCallTimeRef.current === 0 || // First call
        timeSinceLastCall >= delay || // Regular debounce
        (maxWait !== undefined && timeSinceLastInvoke >= maxWait) // Max wait exceeded
      )
    },
    [delay, maxWait]
  )

  // Control functions
  debounced.cancel = useCallback(() => {
    cleanup()
  }, [cleanup])

  debounced.flush = useCallback(() => {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return invoke(time)
    }
  }, [invoke, shouldInvoke])

  debounced.isPending = useCallback(() => {
    return isPendingRef.current
  }, [])

  // Cleanup on unmount
  useUnmount(() => {
    cleanup()
  })

  // Cleanup dan reset ketika dependencies berubah
  useEffect(() => {
    cleanup()
  }, [callback, delay, leading, trailing, maxWait, cleanup])

  return debounced
}
