## BizDisplay Business Display

BizDisplay is useful for field summaries, metric cards, and status displays.

## Preview

:::demo A basic display preview for key metrics.

```html
<biz-display label="Today Orders" value="128" note="Up 12% from yesterday" />
```
:::

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| label | Label text | String | - |
| value | Main value | String / Number | - |
| note | Helper text | String | - |
| layout | Layout, one of `stack` / `inline` | String | `stack` |
| muted | Whether to use a muted background | Boolean | `false` |