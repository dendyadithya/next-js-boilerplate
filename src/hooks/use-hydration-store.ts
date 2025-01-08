import { useEffect, useState } from 'react'
import { UseBoundStore } from 'zustand'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useHydrationStore = (store: UseBoundStore<any>) => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsubHydrate = store.persist.onHydrate(() => setHydrated(false))

    const unsubFinishHydration = store.persist.onFinishHydration(() => setHydrated(true))

    setHydrated(store.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return hydrated
}
