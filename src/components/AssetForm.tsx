import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Asset, AssetStatus } from '../types'

export type AssetFormValues = {
  id?: string
  name: string
  price: string
  purchaseDate: string
  status: AssetStatus
  icon: string
}

type FormErrors = {
  name?: string
  price?: string
  purchaseDate?: string
}

const STATUS_OPTIONS: AssetStatus[] = ['全部', '使用中', '收藏中']

const ICON_OPTIONS = [
  { label: '手机', icon: '📱' },
  { label: '笔记本', icon: '💻' },
  { label: '台式机', icon: '🖥️' },
  { label: '平板', icon: '📲' },
  { label: '手表', icon: '⌚' },
  { label: '相机', icon: '📷' },
  { label: '耳机', icon: '🎧' },
  { label: '音箱', icon: '🔊' },
  { label: '游戏机', icon: '🎮' },
  { label: '电视', icon: '📺' },
  { label: '路由器', icon: '📡' },
  { label: '键盘', icon: '⌨️' },
  { label: '鼠标', icon: '🖱️' },
  { label: '移动硬盘', icon: '💾' },
  { label: '打印机', icon: '🖨️' },
  { label: '无人机', icon: '🛸' },
  { label: '电动工具', icon: '🧰' },
  { label: '灯具', icon: '💡' },
  { label: '冰箱', icon: '🧊' },
  { label: '洗衣机', icon: '🧺' },
  { label: '空调', icon: '❄️' },
  { label: '吸尘器', icon: '🧹' },
  { label: '咖啡机', icon: '☕' },
  { label: '厨房设备', icon: '🍳' },
  { label: '家具', icon: '🛋️' },
  { label: '自行车', icon: '🚲' },
  { label: '汽车', icon: '🚗' },
  { label: '行李箱', icon: '🧳' },
  { label: '衣物', icon: '👕' },
  { label: '饰品', icon: '💍' },
]

type AssetFormProps = {
  initialData?: Asset
  onSubmit: (asset: AssetFormValues) => void
  onClose: () => void
}

export function AssetForm({ initialData, onSubmit, onClose }: AssetFormProps) {
  const defaultValues = useMemo<AssetFormValues>(
    () => ({
      id: initialData?.id,
      name: initialData?.name ?? '',
      price: initialData ? initialData.price.toString() : '',
      purchaseDate: initialData?.purchaseDate ?? new Date().toISOString().slice(0, 10),
      status: initialData?.status ?? '全部',
      icon: initialData?.icon ?? '',
    }),
    [initialData],
  )

  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    setValues(defaultValues)
    setErrors({})
  }, [defaultValues])

  function normalizePrice(value: string) {
    return value.replace(/[^\d.,]/g, '')
  }

  function handleChange<K extends keyof AssetFormValues>(field: K, value: AssetFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!values.name.trim()) {
      errs.name = '名称不能为空，建议少于 60 个字符'
    }
    if (values.name.trim().length > 60) {
      errs.name = '名称建议不超过 60 个字符'
    }

    const parsedPrice = Number(values.price.replace(/,/g, ''))
    if (!values.price || Number.isNaN(parsedPrice)) {
      errs.price = '请输入有效价格'
    } else if (parsedPrice <= 0) {
      errs.price = '价格需大于 0'
    } else if (!/^\d+(\.\d{1,2})?$/.test(values.price.replace(/,/g, ''))) {
      errs.price = '最多两位小数'
    }

    if (!values.purchaseDate) {
      errs.purchaseDate = '请选择购买日期'
    } else {
      const target = new Date(values.purchaseDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (target.getTime() > today.getTime()) {
        errs.purchaseDate = '购买日期不能晚于今天'
      }
    }

    return errs
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    onSubmit(values)
  }

  function handleReset() {
    setValues(defaultValues)
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="premium-card max-h-[90vh] overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {initialData ? '编辑资产' : '新增资产'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="button-secondary cursor-pointer p-2 rounded-lg"
          aria-label="关闭"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Asset Name */}
        <div className="flex flex-col gap-2">
          <label className="form-label" htmlFor="asset-name">
            资产名称 <span className="text-red-500">*</span>
          </label>
          <input
            id="asset-name"
            value={values.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="例如：MacBook Pro、家庭基金"
            className="form-input"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-2">
          <label className="form-label" htmlFor="asset-price">
            资产价格 <span className="text-red-500">*</span>
          </label>
          <div className="form-input flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              ¥
            </span>
            <input
              id="asset-price"
              value={values.price}
              onChange={(event) => handleChange('price', normalizePrice(event.target.value))}
              placeholder=""
              inputMode="decimal"
              autoComplete="off"
              className="w-full bg-transparent text-[inherit] outline-none border-0 p-0 m-0"
            />
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            示例：12,800.00（正数，最多两位小数，支持千位分隔符）
          </p>
          {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
        </div>

        {/* Date and Status */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="form-label" htmlFor="asset-date">
              购买日期 <span className="text-red-500">*</span>
            </label>
            <input
              id="asset-date"
              type="date"
              value={values.purchaseDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(event) => handleChange('purchaseDate', event.target.value)}
              className="form-input"
            />
            {errors.purchaseDate && <p className="text-xs text-red-500">{errors.purchaseDate}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="form-label" htmlFor="asset-status">
              状态
            </label>
            <select
              id="asset-status"
              value={values.status}
              onChange={(event) => handleChange('status', event.target.value as AssetStatus)}
              className="form-input"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Icon Selection */}
        <div className="flex flex-col gap-2">
          <label className="form-label" htmlFor="asset-icon">
            图标/emoji（可选）
          </label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.slice(0, 12).map((option) => {
              const isActive = values.icon.trim() === option.icon
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleChange('icon', option.icon)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                      : 'border-[var(--color-border)] bg-[rgba(255,255,255,0.4)] hover:border-[var(--color-text-secondary)]'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="text-base">{option.icon}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => handleChange('icon', '')}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-sm transition-all duration-200 hover:border-[var(--color-text-secondary)] cursor-pointer"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              清除
            </button>
            <button
              type="button"
              onClick={() => {
                const moreIcons = ICON_OPTIONS.slice(12)
                const nextIcon = moreIcons.find(opt => !values.icon.includes(opt.icon))
                if (nextIcon) handleChange('icon', nextIcon.icon)
              }}
              className="rounded-full border border-dashed border-[var(--color-border)] bg-[rgba(255,255,255,0.4)] px-3 py-1.5 text-sm transition-all duration-200 hover:border-[var(--color-text-secondary)] cursor-pointer"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              更多…
            </button>
          </div>
          {/* Show more icons when scrolling or clicking more */}
          {values.icon && !ICON_OPTIONS.slice(0, 12).some(opt => opt.icon === values.icon) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {ICON_OPTIONS.slice(12).map((option) => {
                const isActive = values.icon.trim() === option.icon
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleChange('icon', option.icon)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                        : 'border-[var(--color-border)] bg-[rgba(255,255,255,0.4)] hover:border-[var(--color-text-secondary)]'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="text-base">{option.icon}</span>
                  </button>
                )
              })}
            </div>
          )}
          <input
            id="asset-icon"
            value={values.icon}
            onChange={(event) => handleChange('icon', event.target.value)}
            placeholder="例如：🏡 / 🚗（也可直接选择上面的图标）"
            className="form-input mt-2"
          />
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            输入 emoji 或文字，用于卡片左侧展示
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <footer className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          type="submit"
          className="premium-button cursor-pointer inline-flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          保存资产
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="button-secondary cursor-pointer"
        >
          重置
        </button>
        <button
          type="button"
          onClick={onClose}
          className="button-secondary cursor-pointer ml-auto"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          取消
        </button>
      </footer>
    </form>
  )
}
