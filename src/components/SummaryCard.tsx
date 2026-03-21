import { DailyAvgForecastChart } from './DailyAvgForecastChart'
import { formatCurrency, formatShortDateTime } from '../utils/calc'

type SummaryCardProps = {
  totalCost: number
  totalDailyAvg: number
  forecastPoints: Array<{ label: string; value: number }>
  lastUpdated: Date
  nextRefresh: Date
  onAdd: () => void
}

export function SummaryCard({
  totalCost,
  totalDailyAvg,
  forecastPoints,
  lastUpdated,
  nextRefresh,
  onAdd,
}: SummaryCardProps) {
  return (
    <section className="premium-card reveal flex flex-col gap-6 p-6 sm:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            资产成本追踪
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            追踪您的资产持有成本与日均支出
          </p>
        </div>
        <button
          onClick={onAdd}
          className="premium-button cursor-pointer inline-flex items-center gap-2 self-start"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新增资产
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="stat-card group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                总资产
              </p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                {formatCurrency(totalCost)}
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                根据明细价格求和
              </p>
            </div>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: 'var(--gradient-subtle)' }}
            >
              <svg className="h-5 w-5" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
          </div>
        </article>

        <article className="stat-card group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                总日均支出
              </p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                {formatCurrency(totalDailyAvg)}
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                包含当天的持有天均折旧
              </p>
            </div>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: 'var(--gradient-subtle)' }}
            >
              <svg className="h-5 w-5" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
          </div>
        </article>
      </div>

      {/* Forecast Chart */}
      <DailyAvgForecastChart points={forecastPoints} />

      {/* Footer */}
      <footer
        className="flex flex-wrap gap-4 pt-4 mt-auto border-t text-xs"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)' }}
      >
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Z" />
          </svg>
          最后更新：{formatShortDateTime(lastUpdated)}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          下次刷新：{formatShortDateTime(nextRefresh)}
        </span>
      </footer>
    </section>
  )
}
