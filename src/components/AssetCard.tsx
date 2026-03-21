import { formatCurrency, formatNumber } from '../utils/calc'
import type { Asset } from '../types'

type AssetCardProps = {
  asset: Asset
  dailyCost: number
  daysHeld: number
  onEdit: (asset: Asset) => void
  onDelete: (asset: Asset) => void
}

export function AssetCard({ asset, dailyCost, daysHeld, onEdit, onDelete }: AssetCardProps) {
  const status = asset.status ?? '全部'
  const icon = asset.icon?.trim() || '📦'

  return (
    <article className="asset-card group">
      <div className="relative z-10">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className="icon-container h-12 w-12 shrink-0 text-2xl flex items-center justify-center rounded-xl"
            >
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="font-semibold text-base truncate transition-colors duration-200"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {asset.name || '未命名资产'}
              </h3>
              <span
                className="inline-block text-xs px-2 py-0.5 rounded-full mt-1"
                style={{
                  color: 'var(--color-text-tertiary)',
                  background: 'var(--gradient-subtle)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="data-cell text-center">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              价格
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {formatCurrency(asset.price)}
            </p>
          </div>
          <div className="data-cell text-center">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              ¥/天
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-accent)', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(dailyCost)}
            </p>
          </div>
          <div className="data-cell text-center">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              持有天数
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {formatNumber(daysHeld, 0)}天
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => onEdit(asset)}
            className="button-secondary cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-all duration-200"
            type="button"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            编辑
          </button>
          <button
            onClick={() => onDelete(asset)}
            className="button-secondary cursor-pointer flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-all duration-200 hover:text-red-600 hover:border-red-200 dark:hover:text-red-400 dark:hover:border-red-900"
            type="button"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            删除
          </button>
        </div>
      </div>
    </article>
  )
}
