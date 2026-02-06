import { useId, useMemo } from 'react'
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatCurrency } from '../utils/calc'

export type ForecastPoint = {
  label: string
  value: number
}

type DailyAvgForecastChartProps = {
  points: ForecastPoint[]
}

// Custom active dot (SVG)
function CustomActiveDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r="12" fill="rgba(202, 138, 4, 0.2)" className="animate-pulse" />
      <circle cx={cx} cy={cy} r="6" fill="rgba(234, 179, 8, 0.4)" />
      <circle cx={cx} cy={cy} r="3" fill="#EAB308" stroke="var(--color-background)" strokeWidth="2" />
    </g>
  )
}

// Custom tick formatter for Y-axis
function formatYAxisTick(value: number) {
  if (value >= 1000) {
    return `¥${(value / 1000).toFixed(1)}k`
  }
  return `¥${value.toFixed(0)}`
}

function parseForecastLabel(label: string) {
  const [yearText, monthText] = label.split('-')
  const year = Number(yearText)
  const month = Number(monthText)
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null
  }
  return { year, month }
}

// Parse label to display format
function formatXAxisLabel(label: string) {
  const parsed = parseForecastLabel(label)
  if (!parsed) {
    return label
  }
  return `${parsed.month}月`
}

function formatTooltipLabel(label: string) {
  const parsed = parseForecastLabel(label)
  if (!parsed) {
    return label
  }
  return `${parsed.year}年${parsed.month}月`
}

export function DailyAvgForecastChart({ points }: DailyAvgForecastChartProps) {
  const chartData = useMemo(
    () =>
      points
        .filter((point) => point.label.trim().length > 0)
        .map((point) => ({
          ...point,
          value: Number.isFinite(point.value) ? point.value : 0,
        })),
    [points],
  )
  const chartId = useId().replace(/:/g, '')
  const gradientId = `${chartId}-forecastGradient`
  const lineGradientId = `${chartId}-lineGradient`
  const glowId = `${chartId}-lineGlow`

  // Calculate Y-axis domain with padding
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100]
    const values = chartData.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const spread = max - min
    const padding = spread > 0 ? spread * 0.1 : Math.max(max * 0.05, 1)
    const lower = Math.max(0, min - padding)
    const upper = max + padding
    const domainMin = Math.floor(lower * 100) / 100
    const domainMax = Math.ceil(upper * 100) / 100
    if (domainMax <= domainMin) {
      return [domainMin, domainMin + 1]
    }
    return [
      domainMin,
      domainMax,
    ]
  }, [chartData])

  const startValue = chartData[0]?.value ?? 0

  if (chartData.length === 0) {
    return (
      <div className="chart-container flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              未来三年日均支出预估
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              基于当前持有资产的折旧趋势
            </p>
          </div>
        </div>
        <div
          className="h-[220px] flex items-center justify-center text-sm"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          暂无数据
        </div>
      </div>
    )
  }

  return (
    <div className="chart-container flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            未来三年日均支出预估
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            基于当前持有资产的折旧趋势
          </p>
        </div>
        <div className="text-right text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          <p>单位：元/天</p>
          <p>起点：{formatCurrency(startValue)}</p>
        </div>
      </div>

      {/* Chart with custom interaction */}
      <div
        className="relative"
        style={{ height: '220px' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(202, 138, 4, 0.3)" />
                <stop offset="50%" stopColor="rgba(202, 138, 4, 0.1)" />
                <stop offset="100%" stopColor="rgba(202, 138, 4, 0)" />
              </linearGradient>
              <linearGradient id={lineGradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
              {/* Glow filter for the line */}
              <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--color-border-subtle)"
              horizontal={true}
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="label"
              tickFormatter={formatXAxisLabel}
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={30}
            />

            {/* Y Axis */}
            <YAxis
              domain={yDomain}
              tickFormatter={formatYAxisTick}
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={50}
            />

            {/* Tooltip */}
            <Tooltip
              cursor={{
                stroke: 'var(--color-accent)',
                strokeWidth: 1,
                strokeOpacity: 0.5,
                strokeDasharray: '4 4',
              }}
              allowEscapeViewBox={{ x: false, y: false }}
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0 || label == null) return null
                const value = Number(payload[0].value ?? 0)
                const rawLabel = String(
                  (payload[0].payload as { label?: string } | undefined)?.label ?? label,
                )
                return (
                  <div
                    className="rounded-xl p-3 shadow-xl backdrop-blur-xl border"
                    style={{
                      background: 'var(--glass-bg-dark)',
                      borderColor: 'rgba(202, 138, 4, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(202, 138, 4, 0.1)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                      {formatTooltipLabel(rawLabel)}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: 'var(--gradient-gold)' }}
                      />
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {formatCurrency(value)}
                        <span className="text-xs font-normal ml-1" style={{ color: 'var(--color-text-tertiary)' }}>
                          /天
                        </span>
                      </p>
                    </div>
                  </div>
                )
              }}
            />

            {/* Area fill */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={`url(#${gradientId})`}
              animationDuration={1000}
              animationEasing="ease-out"
            />

            {/* Line - no built-in interaction */}
            <Line
              type="monotone"
              dataKey="value"
              stroke={`url(#${lineGradientId})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={<CustomActiveDot />}
              animationDuration={1000}
              animationEasing="ease-out"
              filter={`url(#${glowId})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend/Info below chart */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: 'var(--gradient-gold)' }}
          />
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            日均支出趋势
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-3 w-3" style={{ color: 'var(--color-text-tertiary)' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
          </svg>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            移动光标查看详情
          </span>
        </div>
      </div>
    </div>
  )
}
