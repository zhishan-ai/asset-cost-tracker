# TASKS

## Milestone 1：项目初始化与文档
- **包括**：创建 Vite + React + TypeScript + Tailwind 配置、初始化 README/NOTICE、完成 SPEC/ARCH/TESTPLAN/TASKS 文档。
- **完成判定**：`package.json` 已生成并可跑 `npm run dev`（可后期）、SPEC/ARCH/TESTPLAN/TASKS 已存在且详尽。

## Milestone 2：核心状态与存储
- **包括**：实现 `useAssets` 状态管理 hook、localStorage load/save、版本迁移逻辑、输入校验逻辑（price、purchaseDate）。
- **完成判定**：资产数据可 CRUD，控制台无 localStorage parse 错误，旧版本或非法数据能被迁移/清理并反馈。

## Milestone 3：计算与时间驱动
- **包括**：`daysHeld`、`dailyCost`、`totalCost`、`totalDailyAvg` 计算逻辑，精度控制，跨日自动刷新（midnight timer/visibility）。
- **完成判定**：测试当天/跨日/同日等场景，`totalDailyAvg` 与 `dailyCost` 与公式对齐；在接近午夜后触发次数正确。

## Milestone 4：UI 设计与交互
- **包括**：summary card、资产列表卡片、过滤 tab、表单 modal/抽屉、空状态提示、动效/响应式样式。
- **完成判定**：移动端/桌面端均可展示；交互（hover、focus、filter）均有视觉反馈；卡片信息齐全格式正确。

## Milestone 5：持久化与体验打磨
- **包括**：数据保持在 localStorage、空状态/错误提示、动画细节、可访问性加固、测试文档补充、README 说明。
- **完成判定**：刷新或重新打开应用资产不丢失；`localStorage` 版本变化自动处理；动画/动效无显著性能问题。

## Milestone 6：发布与部署准备
- **包括**：构建脚本验证、生成 `dist`、更新 README、可能的部署说明（如 GitHub Pages）。
- **完成判定**：`npm run build` 成功生成产物，README 说明运行流程与部署步骤，CI 配置（如有）已更新。
