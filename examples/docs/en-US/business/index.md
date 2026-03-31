## Business Components Overview

The business components directory is independent from `packages/` and is used for common presentation and card-style components that can be dropped directly into web pages.

> The rich text editor demo depends on Quill. The docs site loads its JS/CSS automatically; if you use it elsewhere, make sure Quill is available first.

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

:::demo A Quill-based rich text editor preview with `v-model` binding.

```html
<biz-rich-text-editor v-model="content" placeholder="Write something great" :height="360" />

<script>
export default {
  data() {
    return {
      content: '<p>Welcome to BizRichTextEditor</p>'
    };
  }
};
</script>
```
:::

## Build output

Business components are bundled into a single entry under `dist/business/`:

- `dist/business/biz-ui.min.js`: business components entry
- `dist/business/biz-ui.min.css`: business components styles

## Directory structure

```text
business/
  biz-card/
  biz-display/
  biz-rich-text-editor/
  components.json
  index.js
```

## Usage

You can import the combined entry when you want all business components, or import a specific component bundle directly when you only need one.

## Direct browser usage

```html
<div id="app">
  <biz-card title="Order Overview" subtitle="Updated at 12:00">
    <div>Total orders: 128</div>
  </biz-card>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.min.js"></script>
<link rel="stylesheet" href="./dist/business/biz-ui.min.css">
<script src="./dist/business/biz-ui.min.js"></script>
<script>
  // You can rely on auto-install, but explicit registration is clearer.
  Vue.use(BizUI);
  new Vue({ el: '#app' });
</script>
```

This is still a Vue component library, so Vue must be loaded first. The components render inside a Vue instance rather than as standalone native HTML elements.