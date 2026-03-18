## BizCard 业务卡片

BizCard 适合展示订单概览、信息卡片、运营面板等内容。

## 预览

:::demo 业务卡片的基础预览，包含标题、副标题、内容和页脚。

```html
<biz-card title="订单概览" subtitle="今日 12:00 更新">
  <div>总订单：128</div>

  <template slot="footer">
    可在这里放按钮或链接
  </template>
</biz-card>
```
:::

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | String | - |
| subtitle | 副标题 | String | - |
| shadow | 阴影类型，可选 `always` / `hover` / `never` | String | `always` |
| bordered | 是否显示边框 | Boolean | `true` |