import { useEffect, useMemo, useState } from 'react'
import type { AssetStatus } from './types'
import { useAssets } from './hooks/useAssets'
import { AssetForm } from './components/AssetForm'
import type { AssetFormValues } from './components/AssetForm'
import { AssetCard } from './components/AssetCard'
import { SummaryCard } from './components/SummaryCard'
import { calculateDailyCost, calculateDaysHeld, getNextMidnight } from './utils/calc'

const STATUS_FILTERS: AssetStatus[] = ['全部', '使用中', '收藏中']
const FORECAST_MONTHS = 36

function addMonthsClamped(base: Date, months: number) {
  const targetMonth = base.getMonth() + months
  const targetYear = base.getFullYear() + Math.floor(targetMonth / 12)
  const normalizedMonth = ((targetMonth % 12) + 12) % 12
  const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate()
  const day = Math.min(base.getDate(), lastDay)
  return new Date(targetYear, normalizedMonth, day)
}

function formatForecastLabel(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function App() {
  const { assets, setAssets, lastSavedAt } = useAssets()
  const [today, setToday] = useState(new Date())
  const [filter, setFilter] = useState<AssetStatus>('全部')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [lastRecalcAt, setLastRecalcAt] = useState<Date>(() => new Date())

  const assetMetrics = useMemo(
    () =>
      assets.map((asset) => {
        const daysHeld = calculateDaysHeld(today, asset.purchaseDate)
        const dailyCost = calculateDailyCost(asset.price, daysHeld)
        return { asset, daysHeld, dailyCost }
      }),
    [assets, today],
  )

  const lastUpdated = useMemo(
    () => new Date(Math.max(lastSavedAt, lastRecalcAt.getTime())),
    [lastSavedAt, lastRecalcAt],
  )

  const filteredAssets = useMemo(
    () =>
      assetMetrics.filter(
        ({ asset }) => filter === '全部' || (asset.status ?? '全部') === filter,
      ),
    [assetMetrics, filter],
  )

  const totalCost = assetMetrics.reduce((sum, { asset }) => sum + asset.price, 0)
  const totalDailyAvg = assetMetrics.reduce((sum, { dailyCost }) => sum + dailyCost, 0)
  const forecastPoints = useMemo(
    () =>
      Array.from({ length: FORECAST_MONTHS }, (_, index) => {
        const futureDate = addMonthsClamped(today, index)
        const forecastDailyAvg = assets.reduce((sum, asset) => {
          const daysHeld = calculateDaysHeld(futureDate, asset.purchaseDate)
          return sum + calculateDailyCost(asset.price, daysHeld)
        }, 0)
        return {
          label: formatForecastLabel(futureDate),
          value: forecastDailyAvg,
        }
      }),
    [assets, today],
  )

  // Midnight auto-refresh with visibility change handling
  useEffect(() => {
    let timer = 0
    const schedule = () => {
      const nextMidnight = getNextMidnight(new Date())
      const delay = Math.max(nextMidnight.getTime() - Date.now(), 0)
      timer = window.setTimeout(() => {
        setToday(new Date())
        setLastRecalcAt(new Date())
        schedule()
      }, delay)
    }
    schedule()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setToday(new Date())
        setLastRecalcAt(new Date())
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const nextRefresh = getNextMidnight(today)

  function handleOpenForm() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditing(null)
  }

  function handleSubmitForm(values: AssetFormValues) {
    const parsedPrice = Number(values.price.replace(/,/g, ''))
    const normalizedPrice = Math.round(parsedPrice * 100) / 100
    const newAsset = {
      id: values.id ?? crypto.randomUUID(),
      name: values.name.trim(),
      price: normalizedPrice,
      purchaseDate: values.purchaseDate,
      status: values.status,
      icon: values.icon.trim(),
    }

    setAssets((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === newAsset.id)
      if (existingIndex >= 0) {
        const copy = [...prev]
        copy[existingIndex] = newAsset
        return copy
      }
      return [...prev, newAsset]
    })
    setLastRecalcAt(new Date())
    handleCloseForm()
  }

  function handleEdit(assetId: string) {
    setEditing(assetId)
    setFormOpen(true)
  }

  function handleDelete(assetId: string) {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId))
    setLastRecalcAt(new Date())
  }

  const editingAsset = assets.find((asset) => asset.id === editing) ?? null

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <SummaryCard
          totalCost={totalCost}
          totalDailyAvg={totalDailyAvg}
          forecastPoints={forecastPoints}
          lastUpdated={lastUpdated}
          nextRefresh={nextRefresh}
          onAdd={handleOpenForm}
        />
        <section className="flex flex-col gap-4">
          <div className="premium-card reveal reveal-delay-1 flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`filter-chip cursor-pointer transition-all duration-200 ${
                    filter === status ? 'filter-chip-active' : ''
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              总数 {assetMetrics.length} 条
            </p>
          </div>
          <div className="grid gap-4">
            {filteredAssets.length === 0 ? (
              <div className="premium-card reveal reveal-delay-2 flex flex-col items-center gap-4 border-2 border-dashed p-12 text-center">
                <div
                  className="mb-2 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: 'var(--gradient-subtle)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <svg className="h-8 w-8" style={{ color: 'var(--color-text-tertiary)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
                  </svg>
                </div>
                <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  还没有资产，快添加第一笔吧！
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                  资产会自动记录在本地，刷新也不会丢失。
                </p>
                <button
                  type="button"
                  onClick={handleOpenForm}
                  className="premium-button cursor-pointer"
                >
                  添加资产
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssets.map((entry, index) => (
                  <div
                    key={`${filter}-${entry.asset.id}`}
                    className="reveal"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AssetCard
                      asset={entry.asset}
                      dailyCost={entry.dailyCost}
                      daysHeld={entry.daysHeld}
                      onEdit={() => handleEdit(entry.asset.id)}
                      onDelete={() => handleDelete(entry.asset.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {formOpen && (
        <div className="modal-overlay">
          <div className="w-full max-w-2xl">
            <AssetForm initialData={editingAsset ?? undefined} onSubmit={handleSubmitForm} onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
