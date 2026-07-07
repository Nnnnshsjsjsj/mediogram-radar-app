import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { fetchFeed } from './feed'
import type { Feed } from './feed'

interface FeedState {
  feed: Feed | null
  loading: boolean
  error: string | null
  refresh: () => void
  refreshing: boolean
}

const FeedContext = createContext<FeedState | null>(null)

export function FeedProvider({ children }: { children: ReactNode }) {
  const [feed, setFeed] = useState<Feed | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (isRefresh: boolean) => {
    isRefresh ? setRefreshing(true) : setLoading(true)
    setError(null)
    try {
      const f = await fetchFeed()
      setFeed(f)
    } catch (e) {
      setError((e as Error).message || 'Failed to load feed')
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false)
    }
  }, [])

  useEffect(() => { load(false) }, [load])

  const refresh = useCallback(() => { load(true) }, [load])

  return (
    <FeedContext.Provider value={{ feed, loading, error, refresh, refreshing }}>
      {children}
    </FeedContext.Provider>
  )
}

export function useFeed(): FeedState {
  const ctx = useContext(FeedContext)
  if (!ctx) throw new Error('useFeed must be used within FeedProvider')
  return ctx
}
