import { isValidElement, ReactNode } from 'react'

type NullableObject = { [key: string]: unknown }

// Perbaikan type utility untuk menghilangkan null dari union types
type NonNullableObject<T> = {
  [K in keyof T]: T[K] extends (infer U)[] ? NonNullable<U>[] : NonNullable<T[K]>
}

export function isEmptyStateComponent(value: unknown): value is ReactNode {
  return isValidElement(value)
}

export function useRequiredStates<T extends NullableObject>(
  states: T,
  EmptyStateComponent: ReactNode
): NonNullableObject<T> {
  const hasInvalidState = Object.entries(states).some(([, value]) => {
    if (Array.isArray(value)) return value.length === 0
    return value == null
  })

  if (hasInvalidState) {
    if (EmptyStateComponent) {
      return EmptyStateComponent as NonNullableObject<T>
    }
    throw new Error('Required states are not available')
  }

  return states as NonNullableObject<T>
}
