# ARCH

## 技术栈
- 基于 Vite + React + TypeScript + Tailwind CSS，保持依赖精简（仅 React、React DOM、Tailwind）。
- 入口结构：`src/main.tsx` 挂载 `<App />`；Tailwind 样式通过 `index.css` 引入。
- 构建/开发：`npm run dev`（Vite）、`npm run build`、`npm run preview`，默认配置即可。

## 状态与数据流设计
- 使用 React 状态（`useState`/`useReducer` + `useMemo`）或 Zustand 轻状态库（若使用，需说明保持依赖少）。核心状态：
  - `assets`：数组，包含所有资产记录。
  - `today`：由 `new Date()` 生成的当前本地日期，仅保留年月日，用来驱动计算与 display。
- 派生数据：
  - `daysHeld`：`Math.max(1, diffDays(today, purchaseDate) + 1)`；用 `date-fns`（若加入）或手写起始/终止日 diff。
  - `dailyCost` 每 asset：`price / daysHeld`；在 memo 中保持高精度，展示时格式化 `toFixed(2)`。
  - `totalCost`：`assets.reduce((sum, asset) => sum + asset.price, 0)`。
  - `totalDailyAvg`：`assets.reduce((sum, asset) => sum + asset.dailyCost, 0)`。
- 过滤器/视图状态：`statusFilter` 控制展示 `filterAssets(assets)`。
- UI 驱动：
  - Summary card 由 `totalCost` + `totalDailyAvg` 驱动，使用 `useTransition`/CSS 动画。
  - Asset list 卡片根据 `assets` 渲染，包含 `dailyCost`、`daysHeld`、`name`、`status`、`price`。

## localStorage 持久化与版本迁移
- 读取：封装 `loadAssets()`，尝试从 `localStorage.getItem('assetManager_v1')` 解析 JSON。
  - 若数据不存在，返回空数组并写入空结构。
  - 若数据以旧版本（`assetManager_v0`）存在，调用 `migrateV0toV1(old)` 并覆盖新 key。
  - JSON 解析失败/数据结构不合法时，清空并记录。
- 写入：`saveAssets(assets)` 通过 `JSON.stringify` 存回 `assetManager_v1` 路径。
- 版本迁移策略：
  - 每次 schema 改动（如新增 `status`/`icon`），通过版本号判断并按需补默认值。
  - `migrateV0toV1`：从旧字段填充新字段（`status` 默认 `全部`、`icon` 为空）。
  - 记录 `lastUpdatedAt` 可选字段，用于 future `diffDays` 诊断。
- `useEffect`：在 `assets` 更新时保存，并在组件卸载时同步 flush；防止 `setState` 后未写入。

## 过午夜刷新机制
- 目标：确保 `daysHeld` 与 `dailyCost` 自动截至本地午夜刷新，而非依赖用户手动刷新。
- 实现步骤：
  1. 在 app mount 时调用 `scheduleMidnightRefresh()`。
  2. 计算距离下一个本地午夜的毫秒数：`const now = new Date(); const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1); tomorrow.setHours(0,0,0,0); const ms = tomorrow.getTime() - now.getTime();`
  3. 使用 `setTimeout` 在 `ms` 后更新 `today`（或触发 `forceUpdate`）以重新计算。`setInterval` 不推荐，避免 drift。
  4. 清理：在 `useEffect` 清理阶段 `clearTimeout(timerId)`。
  5. `today` 更新后，归属 `assets` 计算 rerun，`totalDailyAvg` 下降。
- 额外：若 app 长时间后台（浏览器 throttle），也可在 `visibilitychange` 事件中补偿，重新计算 `today`。

## UI 与 UX 细节
- Summary card + asset card 组合使用 Tailwind 圆角、阴影、渐进动画（如 `transition-all duration-200 ease-out`）。
- 资产列表支持空状态、滚动容器、响应式间距，卡片在移动端铺满宽度，在桌面端保持间隔。
- 交互控件（按钮、筛选）使用 aria 属性，确保可访问性。

## 目录与文件建议
- `src/components/SummaryCard.tsx`
- `src/components/AssetCard.tsx`
- `src/components/AssetForm.tsx`
- `src/hooks/useAssets.ts`
- `src/utils/calc.ts`（封装 `daysHeld`、`dailyCost`、`formatCurrency`）
- `src/storage/localStorage.ts`
