import { useEffect, useMemo, useState } from 'react'
import type { Asset } from '../types'
import { loadAssetsFromStorage, saveAssetsToStorage } from '../storage/localStorage'

export function useAssets() {
  const initial = useMemo(loadAssetsFromStorage, [])
  const [assets, setAssets] = useState<Asset[]>(initial.assets)
  const [lastSavedAt, setLastSavedAt] = useState<number>(initial.lastUpdatedAt)

  useEffect(() => {
    saveAssetsToStorage(assets)
    setLastSavedAt(Date.now())
  }, [assets])

  return {
    assets,
    setAssets,
    lastSavedAt,
  }
}
