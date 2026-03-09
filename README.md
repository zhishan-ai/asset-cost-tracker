<div align="center">
  <h1>Asset Cost Tracker</h1>
  <p><strong>把每一件你买过的东西，换算成每天的成本。</strong></p>
  <p>一个简单、干净、纯本地的资产成本追踪工具。</p>
  <p>不需要登录，不需要后端，打开就能开始记录。</p>
</div>

<p align="center">
  本地保存 · 自动计算 · 跨午夜刷新 · 桌面与移动端都能使用
</p>

<p align="center">
  <img src="./docs/screenshots/dashboard-desktop.png" alt="Asset Cost Tracker dashboard" width="100%">
</p>

## 为什么会想用它

很多东西买回来以后，价格会很快被忘记。

但真正有意思的问题其实是：它到今天为止，平均每天花了多少钱？

Asset Cost Tracker 就是把这个问题做得足够直接。你只需要输入名称、价格和购买日期，它就会自动帮你算出：

- 这件资产已经持有了多少天
- 现在平均每天的成本是多少
- 你的全部资产加起来，总共花了多少
- 如果继续持有，未来的日均成本会怎么变化

## 一眼能看到什么

<table>
  <tr>
    <td width="33%" align="center">
      <h3>总资产</h3>
      <p>把你录入的价格直接汇总，快速看到目前一共投入了多少。</p>
    </td>
    <td width="33%" align="center">
      <h3>总日均支出</h3>
      <p>不是模糊感受，而是按持有天数算出来的真实日均成本。</p>
    </td>
    <td width="33%" align="center">
      <h3>趋势变化</h3>
      <p>未来 36 个月的日均支出走势一眼可见，长期持有会越来越清楚。</p>
    </td>
  </tr>
</table>

## 录入也很轻

<p align="center">
  <img src="./docs/screenshots/asset-form.png" alt="Asset Cost Tracker asset form" width="420">
</p>

你可以记录：

- 资产名称
- 价格
- 购买日期
- 状态
- 图标

适合用来管理数码设备、家电、摄影器材、家具、收藏品，或者任何你想知道“每天成本”的东西。

## 这个应用能帮你做什么

- 新增、编辑、删除资产
- 按 `全部`、`使用中`、`收藏中` 进行筛选
- 查看每项资产的持有天数
- 查看每项资产的日均成本
- 查看全部资产的总金额与总日均支出
- 在本地浏览器中保存数据，刷新页面也不会丢

系统会把购买当天算作第 1 天，并在本地跨过午夜后自动刷新数据，这样你每天看到的结果都会跟着时间自然变化。

## 开始使用

### 环境要求

- Node.js 20+
- npm 10+

### 启动命令

```bash
npm install
npm run dev
```

默认开发地址通常是 [http://localhost:5173](http://localhost:5173)。

## 怎么用

1. 打开应用后，点击“新增资产”。
2. 输入资产名称、价格和购买日期。
3. 如果你愿意，可以补充状态和图标。
4. 保存后，首页会立刻更新总资产、日均成本和趋势图。

## 开源协议

本项目基于 [MIT License](./LICENSE) 开源。
