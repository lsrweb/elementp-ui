## BizCard Business Card

BizCard works well for order summaries, info cards, and dashboard panels.

## Preview

:::demo A basic card preview with title, subtitle, body, and footer.

```html
<biz-card title="Order Overview" subtitle="Updated at 12:00">
  <div>Total orders: 128</div>

  <template slot="footer">
    Put actions or links here
  </template>
</biz-card>
```
:::

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Card title | String | - |
| subtitle | Card subtitle | String | - |
| shadow | Shadow style, one of `always` / `hover` / `never` | String | `always` |
| bordered | Whether to show border | Boolean | `true` |