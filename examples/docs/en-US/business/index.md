## Business Components Overview

The business components directory is independent from `packages/` and is used for common presentation and card-style components that can be dropped directly into web pages.

## Component preview

:::demo A basic business card preview.

```html
<biz-card title="Order Overview" subtitle="Updated at 12:00">
  <div>Total orders: 128</div>

  <template slot="footer">
    Put actions or links here
  </template>
</biz-card>
```
:::

:::demo A quick business display preview for key metrics.

```html
<biz-display label="Today Orders" value="128" note="Up 12% from yesterday" />
```
:::

## Build output

Business components are built separately into `dist/business/`:

- `dist/business/index.min.js`: business components entry
- `dist/business/index.min.css`: business components styles
- `dist/business/biz-card.min.js`: business card component bundle
- `dist/business/biz-card.min.css`: business card styles
- `dist/business/biz-display.min.js`: business display component bundle
- `dist/business/biz-display.min.css`: business display styles

## Directory structure

```text
business/
  biz-card/
  biz-display/
  components.json
  index.js
```

## Usage

You can import the combined entry when you want all business components, or import a specific component bundle directly when you only need one.

## Direct browser usage

```html
<link rel="stylesheet" href="./dist/business/index.min.css">
<script src="./dist/business/index.min.js"></script>
```

If you only need one component, include the matching `.js` and `.css` pair, such as `biz-card.min.js` + `biz-card.min.css`.