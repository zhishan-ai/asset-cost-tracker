# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/claude-code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Vite dev server
- `npm run build` - TypeScript check + production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Overview

A lightweight asset cost tracking tool (资产管理小工具) built with React + TypeScript + Vite + Tailwind CSS. The app calculates and displays the daily cost of owned assets based on purchase date and price.

## Core Calculation Formulas (Critical)

These formulas from SPEC.md must never be altered:

1. `daysHeld_i = max(1, diffDays(today, purchaseDate_i) + 1)` - Purchase day counts as day 1, today included
2. `dailyCost_i = price_i / daysHeld_i`
3. `totalCost = sum(price_i)`
4. `totalDailyAvg = sum(dailyCost_i)`

All calculations are driven by a local `today` state variable that auto-refreshes at midnight.

## Architecture

### Directory Structure
- `src/components/` - React components (AssetCard, AssetForm, SummaryCard, DailyAvgForecastChart)
- `src/hooks/useAssets.ts` - Custom hook wrapping localStorage persistence
- `src/storage/localStorage.ts` - localStorage I/O with versioning (key: `assetManager_v1`) and migration from legacy `assetManager_v0`
- `src/utils/calc.ts` - Core calculation functions (`calculateDaysHeld`, `calculateDailyCost`, `getNextMidnight`, formatters)

### Data Flow
1. `useAssets` hook loads from localStorage on mount, manages `assets` array state
2. `App.tsx` maintains `today` state and schedules midnight auto-refresh via `setTimeout`
3. Derived metrics (`daysHeld`, `dailyCost`, totals) computed via `useMemo`
4. All asset changes persist to localStorage automatically through the hook's `useEffect`

### Midnight Refresh Mechanism
The app implements local-midnight auto-refresh in `App.tsx:80-105`:
- Calculates ms until next local midnight
- Uses `setTimeout` to update `today` state, triggering recalculation
- Also listens to `visibilitychange` to refresh when tab becomes visible

### Dependencies
Keep minimal - only React, React DOM, and Tailwind CSS. No state management libraries or date libraries (calculations are vanilla JS).

## Asset Schema

```typescript
interface Asset {
  id: string          // UUID, auto-generated
  name: string        // Required, max ~60 chars
  price: number       // Required, positive, max 2 decimal places
  purchaseDate: string // YYYY-MM-DD format, cannot be future
  status?: AssetStatus // '全部' | '使用中' | '收藏中'
  icon?: string       // Emoji or icon path
}
```

## UI/UX Notes

- Apple-inspired design with rounded corners, soft shadows, subtle animations
- Responsive: mobile single-column, desktop multi-column grid
- Filter chips for status filtering (全部/使用中/收藏中)
- Empty state: "还没有资产，快添加第一笔吧！"
- Canvas-based particle trail effect on mouse/touch move
- Stagger reveal animations on asset cards

## Storage Versioning

Current version is `assetManager_v1`. The storage layer handles:
- Schema validation via `isAssetShape()` runtime type guard
- Migration from legacy `assetManager_v0` format
- Graceful error recovery with console logging
