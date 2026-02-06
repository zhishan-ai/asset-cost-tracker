const MS_PER_DAY = 24 * 60 * 60 * 1000

export function toLocalDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function parsePurchaseDate(value: string) {
  const [year, month, day] = value.split('-').map((segment) => Number(segment))
  if ([year, month, day].some(Number.isNaN)) {
    return null
  }
  return new Date(year, month - 1, day)
}

export function calculateDaysHeld(today: Date, purchaseDate: string) {
  const purchase = parsePurchaseDate(purchaseDate)
  if (!purchase) {
    return 1
  }
  const todayBase = toLocalDate(today)
  const diffDays = Math.round((todayBase.getTime() - purchase.getTime()) / MS_PER_DAY)
  return Math.max(1, diffDays + 1)
}

export function calculateDailyCost(price: number, daysHeld: number) {
  return daysHeld > 0 ? price / daysHeld : price
}

export function formatCurrency(value: number) {
  return value
    .toLocaleString('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace('CNY', '¥')
}

export function formatNumber(value: number, decimals = 2) {
  return value.toFixed(decimals)
}

export function getNextMidnight(base = new Date()) {
  const next = new Date(base)
  next.setDate(next.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return next
}

export function formatShortDateTime(value: Date) {
  return value.toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
