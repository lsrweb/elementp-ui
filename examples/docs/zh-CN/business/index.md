## 业务组件总览

业务组件目录独立于 `packages/`，用于存放网页里常用的展示型、卡片型业务封装。

## 组件预览

:::demo 这是一个最基础的业务卡片预览。

```html
<biz-card title="订单概览" subtitle="今日 12:00 更新">
  <div>总订单：128</div>

  <template slot="footer">
    可在这里放按钮或链接
  </template>
</biz-card>
```
:::

:::demo 这是一个业务展示组件预览，适合放关键指标。

```html
<biz-display label="今日订单" value="128" note="较昨日增长 12%" />
```
:::

## 构建产物

业务组件会单独构建到 `dist/business/`：

- `dist/business/index.min.js`：业务组件总入口
- `dist/business/index.min.css`：业务组件总样式
- `dist/business/biz-card.min.js`：业务卡片组件
- `dist/business/biz-card.min.css`：业务卡片样式
- `dist/business/biz-display.min.js`：业务展示组件
- `dist/business/biz-display.min.css`：业务展示样式

## 目录结构

```text
business/
  biz-card/
  biz-display/
  components.json
  index.js
```

## 使用方式

如果需要一次性引入所有业务组件，可以直接使用总入口；如果只需要某一个组件，也可以按需引入对应文件。

## 浏览器直接使用

```html
<link rel="stylesheet" href="./dist/business/index.min.css">
<script src="./dist/business/index.min.js"></script>
```

如果只需要单个组件，也可以同时引入对应的 `.js` 和 `.css` 文件，例如 `biz-card.min.js` + `biz-card.min.css`。