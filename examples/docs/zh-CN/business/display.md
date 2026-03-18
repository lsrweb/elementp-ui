## BizDisplay 业务展示

BizDisplay 适合做字段摘要、数值卡片、状态展示等。

## 预览

:::demo 业务展示组件的基础预览，适合展示关键数据。

```html
<biz-display label="今日订单" value="128" note="较昨日增长 12%" />
```
:::

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签 | String | - |
| value | 主值 | String / Number | - |
| note | 说明文字 | String | - |
| layout | 布局，可选 `stack` / `inline` | String | `stack` |
| muted | 是否使用弱化背景 | Boolean | `false` |