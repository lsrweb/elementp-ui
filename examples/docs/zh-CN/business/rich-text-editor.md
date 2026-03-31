## BizRichTextEditor 富文本编辑器

BizRichTextEditor 基于 Quill 实现，适合公告编辑、内容运营、后台表单中的富文本输入场景。

> 使用前请先确保页面已经加载 Quill（文档站已自动注入其 JS/CSS）。

## 配置演示

:::demo 基础富文本编辑器示例，支持 `v-model` 双向绑定，并可自定义占位符与高度。

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

:::demo 隐藏工具栏，适合阅读态、极简编辑场景，或者只想保留正文输入区域时使用。

```html
<biz-rich-text-editor
  v-model="content"
  :toolbar="false"
  :read-only="true"
  placeholder="工具栏已隐藏"
/>

<script>
export default {
  data() {
    return {
      content: '<p>这是一个隐藏工具栏的编辑器示例。</p>'
    };
  }
};
</script>
```
:::

:::demo 使用数组自定义工具栏，只保留常用格式按钮，方便按业务裁剪编辑能力。

```html
<biz-rich-text-editor
  v-model="content"
  :toolbar="toolbar"
  placeholder="自定义工具栏"
/>

<script>
export default {
  data() {
    return {
      content: '<p>这是一个自定义工具栏的示例。</p>',
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'blockquote', 'clean']
      ]
    };
  }
};
</script>
```
:::

:::demo 只读与禁用两种状态，分别适合内容回显和表单锁定场景。

```html
<div style="display: grid; gap: 16px;">
  <biz-rich-text-editor
    v-model="readonlyContent"
    :toolbar="false"
    read-only
    placeholder="只读模式"
    :height="180"
  />

  <biz-rich-text-editor
    v-model="disabledContent"
    disabled
    placeholder="禁用模式"
    :height="180"
  />
</div>

<script>
export default {
  data() {
    return {
      readonlyContent: '<p>只读模式下内容可查看，但不能编辑。</p>',
      disabledContent: '<p>禁用状态下编辑器会整体锁定。</p>'
    };
  }
};
</script>
```
:::

:::demo 使用 `height` 与 `options` 传递 Quill 原生配置，适合做更贴近业务的集成调整。

```html
<biz-rich-text-editor
  v-model="content"
  :height="480"
  placeholder="支持更高的编辑区"
  :options="editorOptions"
/>

<script>
export default {
  data() {
    return {
      content: '<p>你可以通过 options 透传 Quill 原生参数。</p>',
      editorOptions: {
        modules: {
          history: {
            delay: 1000,
            maxStack: 200,
            userOnly: true
          }
        }
      }
    };
  }
};
</script>
```
:::

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 富文本内容，HTML 字符串 | String | `''` |
| placeholder | 占位文本 | String | `请输入内容` |
| height | 编辑器最小高度，支持数字或带单位的字符串 | String / Number | `320px` |
| disabled | 是否禁用 | Boolean | `false` |
| readOnly | 是否只读 | Boolean | `false` |
| toolbar | 工具栏配置，传 `false` 可隐藏工具栏，数组形式可自定义按钮 | Boolean / Array / Object / String | 默认工具栏 |
| theme | Quill 主题 | String | `snow` |
| options | 传给 Quill 的额外配置；如同时传入 `toolbar`，组件会优先使用 `toolbar` 属性 | Object | `{}` |

## Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| focus | 使编辑器获取焦点 | - |
| blur | 使编辑器失去焦点 | - |
| getHtml | 获取当前富文本 HTML 内容 | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| input | 编辑内容变化时触发，用于 `v-model` | `value: string` |
| change | 编辑内容变化时触发 | `value: string, delta, oldDelta, source` |
| focus | 编辑器获得焦点时触发 | `range, oldRange, source` |
| blur | 编辑器失去焦点时触发 | `oldRange, source` |

## 使用说明

- `toolbar` 设置为 `false` 时会隐藏工具栏。
- `toolbar` 的优先级高于 `options.modules.toolbar`，便于在业务组件里统一控制工具栏。
- `options` 会原样透传给 Quill，可继续扩展 history、clipboard、mention 等原生能力。
- 如果你在非文档站项目中使用，请确保先引入 Quill 的 JS/CSS。