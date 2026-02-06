import type { Asset } from '../types'

const STORAGE_KEY = 'assetManager_v1'
const LEGACY_KEY = 'assetManager_v0'

type StoragePayload = {
  version: '1'
  assets: Asset[]
  lastUpdatedAt: number
}

type LegacyRecord = Record<string, unknown>

function isAssetShape(value: unknown): value is Asset {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const record = value as LegacyRecord
  const hasRequired =
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.price === 'number' &&
    typeof record.purchaseDate === 'string'

  return hasRequired
}

function migrateLegacy(arr: unknown[]): Asset[] {
  return arr
    .filter((item): item is LegacyRecord => typeof item === 'object' && item !== null)
    .map((record) => {
      const price = Number(record.price ?? 0)
      const asset: Asset = {
        id: typeof record.id === 'string' ? record.id : crypto.randomUUID(),
        name: typeof record.name === 'string' ? record.name : '',
        price: Number.isFinite(price) ? price : 0,
        purchaseDate: typeof record.purchaseDate === 'string' ? record.purchaseDate : new Date().toISOString().slice(0, 10),
        status: typeof record.status === 'string' ? (record.status as Asset['status']) : '全部',
        icon: typeof record.icon === 'string' ? record.icon : '',
      }
      return asset
    })
}

export function loadAssetsFromStorage() {
  if (typeof window === 'undefined') {
    return {
      assets: [] as Asset[],
      lastUpdatedAt: Date.now(),
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.version === '1' && Array.isArray(parsed.assets)) {
        const assets = parsed.assets.filter(isAssetShape)
        return {
          assets,
          lastUpdatedAt: typeof parsed.lastUpdatedAt === 'number' ? parsed.lastUpdatedAt : Date.now(),
        }
      }
    }

    const legacyRaw = localStorage.getItem(LEGACY_KEY)
    if (legacyRaw) {
      const parsedLegacy = JSON.parse(legacyRaw)
      if (Array.isArray(parsedLegacy)) {
        const migrated = migrateLegacy(parsedLegacy)
        saveAssetsToStorage(migrated)
        localStorage.removeItem(LEGACY_KEY)
        return {
          assets: migrated,
          lastUpdatedAt: Date.now(),
        }
      }
    }

    saveAssetsToStorage([])
    return {
      assets: [],
      lastUpdatedAt: Date.now(),
    }
  } catch (error) {
    console.error('assetManager storage error', error)
    localStorage.removeItem(STORAGE_KEY)
    saveAssetsToStorage([])
    return {
      assets: [],
      lastUpdatedAt: Date.now(),
    }
  }
}

export function saveAssetsToStorage(assets: Asset[]) {
  if (typeof window === 'undefined') {
    return
  }
  const payload: StoragePayload = {
    version: '1',
    assets,
    lastUpdatedAt: Date.now(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
