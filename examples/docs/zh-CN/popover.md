## Popover 弹出框

### 基础用法
Popover 的属性与 Tooltip 很类似，它们都是基于`Vue-popper`开发的，因此对于重复属性，请参考 Tooltip 的文档，在此文档中不做详尽解释。

:::demo `trigger`属性用于设置何时触发 Popover，支持四种触发方式：`hover`，`click`，`focus` 和 `manual`。对于触发 Popover 的元素，有两种写法：使用 `slot="reference"` 的具名插槽，或使用自定义指令`v-popover`指向 Popover 的索引`ref`。

```html
<template>
  <el-popover
    placement="top-start"
    title="标题"
    width="200"
    trigger="hover"
    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
    <el-button slot="reference">hover 激活</el-button>
  </el-popover>

  <el-popover
    placement="bottom"
    title="标题"
    width="200"
    trigger="click"
    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
    <el-button slot="reference">click 激活</el-button>
  </el-popover>

  <el-popover
    ref="popover"
    placement="right"
    title="标题"
    width="200"
    trigger="focus"
    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
  </el-popover>
  <el-button v-popover:popover>focus 激活</el-button>

  <el-popover
    placement="bottom"
    title="标题"
    width="200"
    trigger="manual"
    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
    v-model="visible">
    <el-button slot="reference" @click="visible = !visible">手动激活</el-button>
  </el-popover>
</template>

<script>
  export default {
    data() {
      return {
        visible: false
      };
    }
  };
</script>
```

:::

### 嵌套信息

可以在 Popover 中嵌套多种类型信息，以下为嵌套表格的例子。

:::demo 利用分发取代`content`属性

```html
<el-popover
  placement="right"
  width="400"
  trigger="click">
  <el-table :data="gridData">
    <el-table-column width="150" property="date" label="日期"></el-table-column>
    <el-table-column width="100" property="name" label="姓名"></el-table-column>
    <el-table-column width="300" property="address" label="地址"></el-table-column>
  </el-table>
  <el-button slot="reference">click 激活</el-button>
</el-popover>

<script>
  export default {
    data() {
      return {
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      };
    }
  };
</script>
```

:::

### 嵌套操作

当然，你还可以嵌套操作，这相比 Dialog 更为轻量：

:::demo

```html
<el-popover
  placement="top"
  width="160"
  v-model="visible">
  <p>这是一段内容这是一段内容确定删除吗？</p>
  <div style="text-align: right; margin: 0">
    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
    <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
  </div>
  <el-button slot="reference">删除</el-button>
</el-popover>

<script>
  export default {
    data() {
      return {
        visible: false,
      };
    }
  }
</script>
```

:::

### Attributes

| 参数               | 说明                                                     | 类型              | 可选值      | 默认值 |
|--------------------|----------------------------------------------------------|-------------------|-------------|--------|
| trigger | 触发方式 | String  | click/focus/hover/manual |    click    |
|  title              | 标题 | String | — | — |
|  content        |  显示的内容，也可以通过 `slot` 传入 DOM   | String            | — | — |
|  width        |  宽度  | String, Number            | — | 最小宽度 150px |
|  placement        |  出现位置  | String | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end |  bottom |
|  disabled       |  Popover 是否可用  | Boolean           | — |  false |
|  value / v-model        |  状态是否可见  | Boolean           | — |  false |
|  offset        |  出现位置的偏移量  | Number           | — |  0 |
|  transition     |  定义渐变动画      | String             | — | fade-in-linear |
|  visible-arrow   |  是否显示 Tooltip 箭头，更多参数可见[Vue-popper](https://github.com/element-component/vue-popper) | Boolean | — | true |
|  popper-options        | [popper.js](https://popper.js.org/docs/v2/) 的参数 | Object            | 参考 [popper.js](https://popper.js.org/docs/v2/) 文档 | `{ boundariesElement: 'body', gpuAcceleration: false }` |
| popper-class | 为 popper 添加类名 | String | — | — |
| open-delay | 触发方式为 hover 时的显示延迟，单位为毫秒 | Number | — | — |
| close-delay | 触发方式为 hover 时的隐藏延迟，单位为毫秒 | number | — | 200 |
| tabindex   | Popover 组件的 [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) | number | — | 0 |
| arrow-offset | 箭头的偏移量 | Number | — | 0 |
| append-to-body | 是否将 popover 元素插入到 `body` 内 | Boolean | — | true |

### Slot

| 参数 | 说明 |
|--- | ---|
| — | Popover 内嵌 HTML 文本 |
| reference | 触发 Popover 显示的 HTML 元素 |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| show | 显示时触发 | — |
| after-enter | 显示动画播放完毕后触发 | — |
| hide | 隐藏时触发 | — |
| after-leave | 隐藏动画播放完毕后触发 | — |
| created | Popper 实例创建完成时触发（定位/样式就绪） | — |

### Methods

以下为实例方法，特别适用于“单例模式”场景：

- `open(options)`：显示 Popover。
  - `options.reference: HTMLElement` 定位参考元素（通常是按钮 DOM）。
  - `options.content: string` 文本内容；也可使用默认 slot 提供富内容。
  - `options.title, options.placement, options.width, options.popperClass` 可选，临时覆盖。
- `close()`：关闭 Popover。
- `toggle(options)`：开关显示；若传入不同的 `reference`，将无缝切换位置；若传入相同 `reference` 且当前已显示，则直接关闭（性能优化）。
- `setReference(el: HTMLElement)`：仅更新定位参考，不改变显示状态。

### 单例模式

在表格等列表中每行都渲染一个 Popover 可能带来性能问题。你可以仅在表格外部放置一个 Popover 组件（不写 `slot="reference"`），并在点击行内按钮时，编程式地打开/关闭这个“单例”Popover。

:::tip
不提供 `slot="reference"` 即进入单例模式。此时不自动绑定触发元素的事件，你需要在业务代码中调用组件实例方法。
:::

:::demo 示例中，列表内部按钮点击后调用 `this.$refs.singletonPopover.open({ reference: 按钮DOM, content: 文本 })`。再次点击其它行的按钮，会复用同一个 Popover，只更新定位与内容。

```html
<template>
  <div>
    <!-- 表格外的 单例 Popover -->
    <el-popover
      ref="singletonPopover"
      placement="right"
      width="220"
      trigger="click"
      @created="val = 'Popover 就绪11'"
      >
       {{ val }}
    </el-popover>

    <!-- 伪代码：表格/列表 -->
    <el-table :data="rows" style="width: 100%">
      <el-table-column prop="name" label="姓名"  width="780">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="onShow(scope, $event)">详情</el-button>
          </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="onShow(scope, $event)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  
  
</template>

<script>
export default {
  data() {
    return { rows: [{ name: '王小虎' }, { name: '张三' }],val: '' };
  },
  methods: {
    onShow(scope, evt) {
      const btn = evt.currentTarget; // 触发元素
      this.val = `当前行：${scope.row.name}`;
      this.$refs.singletonPopover.toggle({ reference: btn });
    }
  }
}
</script>
```

:::

#### 单例模式下可用的实例方法

- `open(options)`：显示 Popover。
  - `options.reference: HTMLElement` 必选，定位参考元素（通常是按钮 DOM）。
  - `options.content: string` 可选，文本内容；也可提前通过默认 slot 提供富内容。
  - `options.title, options.placement, options.width, options.popperClass` 可选，临时覆盖。
- `close()`：关闭 Popover。
- `toggle(options)`：开关显示，未显示时等同 `open(options)`。
- `setReference(el: HTMLElement)`：仅更新定位参考，不改变显示状态。

注意：

- 单例模式下组件不会自动监听触发元素的 `click/hover/focus` 等事件；请在业务代码中自行调用上述方法。
- 点击页面空白区域将自动关闭（`trigger="click"` 时）。
- 性能优化：当再次对同一个触发元素调用 `toggle({ reference })/open({ reference })` 且当前已显示时，Popover 会直接关闭，而不会重建实例。
