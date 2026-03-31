## 业务组件总览

业务组件目录独立于 `packages/`，用于存放网页里常用的展示型、卡片型业务封装。

> 本页的富文本编辑器示例依赖 Quill；文档站已自动加载其 JS/CSS，若在其它项目中使用，也需要先引入 Quill。

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

:::demo 基于 Quill 的富文本编辑器预览，支持 `v-model` 双向绑定。

```html
<biz-rich-text-editor v-model="content" placeholder="请输入正文" :height="360" />

<script>
export default {
  data() {
    return {
      content: '<p>欢迎使用 BizRichTextEditor</p>'
    };
  }
};
</script>
```
:::

## 构建产物

业务组件会打包成一个独立入口，输出到 `dist/business/`：

- `dist/business/biz-ui.min.js`：业务组件总入口
- `dist/business/biz-ui.min.css`：业务组件总样式

## 目录结构

```text
business/
  biz-card/
  biz-display/
  biz-rich-text-editor/
  components.json
  index.js
```

## 使用方式

如果需要一次性引入所有业务组件，可以直接使用总入口；如果只需要某一个组件，也可以按需引入对应文件。

## 浏览器直接使用

```html
<div id="app">
  <biz-card title="订单概览" subtitle="今日 12:00 更新">
    <div>总订单：128</div>
  </biz-card>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.min.js"></script>
<link rel="stylesheet" href="./dist/business/biz-ui.min.css">
<script src="./dist/business/biz-ui.min.js"></script>
<script>
  // 既可以依赖自动安装，也可以显式注册；推荐显式调用，更直观
  Vue.use(BizUI);
  new Vue({ el: '#app' });
</script>
```

注意：这是 Vue 组件库，页面里仍然需要先有 Vue，再加载 `biz-ui.min.js`。组件不是原生 HTML 标签，必须挂到一个 Vue 实例上才会渲染。