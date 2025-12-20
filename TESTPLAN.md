# TESTPLAN

## 总则
使用手工/自动化校验用户输入、计算公式、localStorage 持久化与跨日刷新。每条用例说明输入数据、期望行为与校验点。共同覆盖日期边界（当日、跨日、未来等）、空列表、日均变化、持久化等。

1. **空列表初始加载**：`localStorage` 清空后打开页面，期待空状态提示与“新增资产”按钮可见。
2. **新增资产（标准数据）**：输入合法 name、price=1000.00、purchaseDate=当天，提交后卡片出现，`dailyCost=1000.00`、`daysHeld=1`。
3. **持久化验证**：新增资产后刷新页面，卡片仍在；`localStorage` 包含该资产。
4. **同日多资产**：两笔资产同一 purchaseDate，验证 `daysHeld=1` 且 `totalDailyAvg` 为两者价格之和。
5. **跨日天数计算**：资产 purchaseDate 为三天前，当天 `daysHeld=4`（以今天算），`dailyCost=price/4`。
6. **未来日期禁止**：输入 `purchaseDate` 超过今天，表单拒绝、提示“不能选择未来日期”。
7. **价格非数字**：price 输入 `abcd` 或空，表单不允许提交，提示“价格需为正数”。
8. **价格两位小数检验**：输入 `123.456` 仅保留两位，提交后 stored price `123.46` 或提示精度限制。
9. **价格为 0 拒绝**：price=0 提交失败，`dailyCost` 不计算，应提示正数。
10. **状态筛选展示**：存在 `使用中` 与 `收藏中` 两种 assets，切换 filter 仅显示对应卡片，`全部` 显示全部。
11. **icon 显示**：资产带 emoji/icon，卡片左侧渲染。
12. **总资产/总日均动态更新**：增加/删除资产后 summary card 数值瞬时变化。
13. **资产删除**：删除某资产后，`localStorage` 更新，不再显示，summary 重新计算。
14. **编辑资产价格**：修改价格后 `dailyCost` 与 `totalCost` 迅速更新；`localStorage` 承载最新价格。
15. **日期跨年验证**：`purchaseDate` 为去年 12 月 31 日，计算 `daysHeld` 基于差值（含跨年）
16. **本地午夜刷新**：在接近本地午夜时（模拟或使用调试）加载页面，跨过午夜后自动 recompute `daysHeld` 与 `dailyCost`，summary 也更新。
17. **localStorage 版本提升**：模拟旧版本 key（如 `assetManager_v0`），初始化时触发迁移逻辑（新 key `assetManager_v1`）。
18. **无 price 数据容错**：`localStorage` 中 asset 缺 price 时忽略并提示清洗；界面空状态仍可操作。
19. **刷新页面但保留 timer**：打开页面，待 timer 触发（间隔到下一个 midnight），确认 timer 清理并重新设定。
20. **设备切换宽度测试**：模拟窄屏（320px）与宽屏（1280px），卡片布局依然保持响应式，文字不溢出。
21. **日均精度四舍五入**：输入 price=1000，daysHeld=3，`dailyCost` 显示 `333.33`。
22. **持有天数最少为 1**：purchaseDate 为未来一天（校验防止）或 today，本地页面 `daysHeld` 至少 1（即使 diffDays 负）。
23. **summary 过渡动画存在**：数值变化时伴随小动画（人工验证）。
24. **导入缺失字段**：手动在 `localStorage` 写入缺少 purchaseDate 的旧数据，加载时提示并不崩溃。
25. **清空所有资产**：点击清空/删除全部后 summary 显示 0，空状态文案出现。
26. **多个时间差异**：一个资产 purchaseDate=7 天前，一个资产=1 天前，`totalDailyAvg` 为两者 `dailyCost` 之和，且下降趋势合理。
27. **输入框与按钮可访问**：确保所有交互控件支持键盘导航与可聚焦提示。
28. **日均总和大于总资产检测**：为防 bug（如不得除以 0），验证 `totalDailyAvg` 不超过 `totalCost` * 1/1 days?` (should be less); ensure sum logic consistent.
