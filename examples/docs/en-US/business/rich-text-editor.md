## BizRichTextEditor Rich Text Editor

BizRichTextEditor is built on top of Quill and works well for announcements, content operations, and rich text fields in admin forms.

> Make sure Quill is available before using this component. The docs site injects the JS/CSS automatically.

## Configuration Demos

:::demo A basic rich text editor example with `v-model` binding, placeholder text, and a custom height.

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

:::demo Hide the toolbar for a minimal reading or content-only experience.

```html
<biz-rich-text-editor
  v-model="content"
  :toolbar="false"
  :read-only="true"
  placeholder="Toolbar hidden"
/>

<script>
export default {
  data() {
    return {
      content: '<p>This editor runs without a toolbar.</p>'
    };
  }
};
</script>
```
:::

:::demo Customize the toolbar with an array to keep only the formatting actions your business flow needs.

```html
<biz-rich-text-editor
  v-model="content"
  :toolbar="toolbar"
  placeholder="Custom toolbar"
/>

<script>
export default {
  data() {
    return {
      content: '<p>This editor uses a custom toolbar.</p>',
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

:::demo Read-only and disabled states are useful for preview and locked form scenarios.

```html
<div style="display: grid; gap: 16px;">
  <biz-rich-text-editor
    v-model="readonlyContent"
    :toolbar="false"
    read-only
    placeholder="Read-only mode"
    :height="180"
  />

  <biz-rich-text-editor
    v-model="disabledContent"
    disabled
    placeholder="Disabled mode"
    :height="180"
  />
</div>

<script>
export default {
  data() {
    return {
      readonlyContent: '<p>Read-only mode keeps the content visible.</p>',
      disabledContent: '<p>Disabled mode locks the whole editor.</p>'
    };
  }
};
</script>
```
:::

:::demo Adjust the editor height and pass through Quill options for more advanced integration scenarios.

```html
<biz-rich-text-editor
  v-model="content"
  :height="480"
  placeholder="A taller editor"
  :options="editorOptions"
/>

<script>
export default {
  data() {
    return {
      content: '<p>Quill options can be passed through options.</p>',
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

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Rich text content as an HTML string | String | `''` |
| placeholder | Placeholder text | String | `请输入内容` |
| height | Editor min-height. Supports numbers or unit strings | String / Number | `320px` |
| disabled | Whether the editor is disabled | Boolean | `false` |
| readOnly | Whether the editor is read only | Boolean | `false` |
| toolbar | Toolbar config. Set `false` to hide the toolbar. Array configs let you fully customize the buttons | Boolean / Array / Object / String | Default toolbar |
| theme | Quill theme | String | `snow` |
| options | Additional Quill options. When both `toolbar` and `options.modules.toolbar` are provided, `toolbar` wins | Object | `{}` |

## Methods

| Method | Description | Parameters |
| --- | --- | --- |
| focus | Focus the editor | - |
| blur | Blur the editor | - |
| getHtml | Get the current HTML content | - |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| input | Emitted when content changes, for `v-model` | `value: string` |
| change | Emitted when content changes | `value: string, delta, oldDelta, source` |
| focus | Emitted when the editor gains focus | `range, oldRange, source` |
| blur | Emitted when the editor loses focus | `oldRange, source` |

## Notes

- Set `toolbar` to `false` to hide the toolbar.
- `toolbar` takes precedence over `options.modules.toolbar`, which makes the business component easier to standardize.
- `options` is passed through to Quill as-is, so you can extend history, clipboard, mention, or other native features.
- If you use this component outside the docs site, make sure Quill's JS/CSS is loaded first.