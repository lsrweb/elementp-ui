## TimePicker 时间选择器

 用于选择或输入时间

### 固定时间点

提供几个固定的时间点供用户选择

:::demo 使用 el-time-select 标签，分别通过`start`、`end`和`step`指定可选的起始时间、结束时间和步长
```html
<el-time-select
  v-model="value"
  :picker-options="{
    start: '08:30',
    step: '00:15',
    end: '18:30'
  }"
  placeholder="选择时间">
</el-time-select>

<script>
  export default {
    data() {
      return {
        value: ''
      };
    }
  }
</script>
```
:::

### 任意时间点

可以选择任意时间

:::demo 使用 el-time-picker 标签，通过`selectableRange`限制可选时间范围。提供了两种交互方式：默认情况下通过鼠标滚轮进行选择，打开`arrow-control`属性则通过界面上的箭头进行选择。
```html
<template>
  <el-time-picker
    v-model="value1"
    :picker-options="{
      selectableRange: '18:30:00 - 20:30:00'
    }"
    placeholder="任意时间点">
  </el-time-picker>
  <el-time-picker
    arrow-control
    v-model="value2"
    :picker-options="{
      selectableRange: '18:30:00 - 20:30:00'
    }"
    placeholder="任意时间点">
  </el-time-picker>
</template>

<script>
  export default {
    data() {
      return {
        value1: new Date(2016, 9, 10, 18, 40),
        value2: new Date(2016, 9, 10, 18, 40)
      };
    }
  }
</script>
```
:::

### 支持选择 24:00

开启 `allow24h` 后，小时列表末尾新增 `24` 选项，用于表示当天结束时刻（即 24:00:00）。选中时分钟与秒自动锁定为 `00`。

:::demo 配合 `value-format="HH:mm:ss"` 时，绑定值输出为字符串 `"24:00:00"`；不设置 `value-format` 时，绑定值为 Date 对象（次日零点）。
```html
<template>
  <el-time-picker
    v-model="value1"
    allow24h
    value-format="HH:mm:ss"
    placeholder="可选 24:00">
  </el-time-picker>
  <el-time-picker
    arrow-control
    v-model="value2"
    allow24h
    value-format="HH:mm:ss"
    placeholder="箭头模式可选 24:00">
  </el-time-picker>
</template>

<script>
  export default {
    data() {
      return {
        value1: '',
        value2: ''
      };
    }
  }
</script>
```
:::

### 自定义格式

通过 `format` 属性控制时间面板显示的列。`HH:mm` 只显示时和分，`HH` 只显示小时。

:::demo `format` 控制面板列的显示，`value-format` 控制绑定值的格式。配合 `allow24h` 可在自定义格式下选择 24:00。
```html
<template>
  <el-time-picker
    v-model="value1"
    format="HH:mm"
    value-format="HH:mm"
    placeholder="时:分">
  </el-time-picker>
  <el-time-picker
    v-model="value2"
    format="HH"
    value-format="HH"
    placeholder="仅小时">
  </el-time-picker>
  <el-time-picker
    v-model="value3"
    format="HH:mm"
    value-format="HH:mm"
    allow24h
    placeholder="时:分 (含24:00)">
  </el-time-picker>
</template>

<script>
  export default {
    data() {
      return {
        value1: '',
        value2: '',
        value3: ''
      };
    }
  }
</script>
```
:::

### 固定时间范围

若先选择开始时间，则结束时间内备选项的状态会随之改变

:::demo
```html
<template>
  <el-time-select
    placeholder="起始时间"
    v-model="startTime"
    :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30'
    }">
  </el-time-select>
  <el-time-select
    placeholder="结束时间"
    v-model="endTime"
    :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30',
      minTime: startTime
    }">
  </el-time-select>
</template>

<script>
  export default {
    data() {
      return {
        startTime: '',
        endTime: ''
      };
    }
  }
</script>
```
:::

### 任意时间范围

可选择任意的时间范围

:::demo 添加`is-range`属性即可选择时间范围，同样支持`arrow-control`属性。
```html
<template>
  <el-time-picker
    is-range
    v-model="value1"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择时间范围">
  </el-time-picker>
  <el-time-picker
    is-range
    arrow-control
    v-model="value2"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择时间范围">
  </el-time-picker>
</template>

<script>
  export default {
    data() {
      return {
        value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        value2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
      };
    }
  }
</script>
```
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| value / v-model | 绑定值 | date(TimePicker) / string(TimeSelect) | — | — |
| readonly | 完全只读 | boolean | — | false |
| disabled | 禁用 | boolean | — | false |
| editable | 文本框可输入 | boolean | — | true |
| clearable | 是否显示清除按钮 | boolean | — | true |
| size          | 输入框尺寸     | string          | medium / small / mini  | — |
| placeholder | 非范围选择时的占位内容 | string | — | — |
| start-placeholder | 范围选择时开始日期的占位内容 | string | — | — |
| end-placeholder | 范围选择时开始日期的占位内容 | string | — | — |
| is-range | 是否为时间范围选择，仅对`<el-time-picker>`有效 | boolean | — | false |
| arrow-control | 是否使用箭头进行时间选择，仅对`<el-time-picker>`有效 | boolean | — | false |
| allow24h | 是否允许选择 24:00，仅对`<el-time-picker>`有效 | boolean | — | false |
| align | 对齐方式 | string | left / center / right | left |
| popper-class | TimePicker 下拉框的类名 | string | — | — |
| picker-options | 当前时间日期选择器特有的选项参考下表 | object | — | {} |
| range-separator | 选择范围时的分隔符 | string | - | '-' |
| value-format | 可选，仅TimePicker时可用，绑定值的格式。不指定则绑定值为 Date 对象 | string | 见[日期格式](#/zh-CN/component/date-picker#ri-qi-ge-shi) | — |
| default-value | 可选，选择器打开时默认显示的时间 | Date(TimePicker) / string(TimeSelect) | 可被`new Date()`解析(TimePicker) / 可选值(TimeSelect) | — |
| name | 原生属性 | string | — | — |
| prefix-icon | 自定义头部图标的类名 | string | — | el-icon-time |
| clear-icon | 自定义清空图标的类名 | string | — | el-icon-circle-close |

### Time Select Options
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| start | 开始时间 | string | — | 09:00 |
| end | 结束时间 | string | — | 18:00 |
| step | 间隔时间 | string | — | 00:30 |
| minTime | 最小时间，小于该时间的时间段将被禁用 | string | — | 00:00 |
| maxTime | 最大时间，大于该时间的时间段将被禁用 | string | — | — |

### Time Picker Options
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| selectableRange | 可选时间段，例如`'18:30:00 - 20:30:00'`或者传入数组`['09:30:00 - 12:00:00', '14:30:00 - 18:30:00']` | string / array | — | — |
| format | 时间格式化(TimePicker) | string | 小时：`HH`，分：`mm`，秒：`ss`，AM/PM `A` | 'HH:mm:ss' |

### Events
| 事件名 | 说明 | 参数 |
|---------|--------|---------|
| change | 用户确认选定的值时触发 | 组件绑定值 |
| blur | 当 input 失去焦点时触发 | 组件实例 |
| focus | 当 input 获得焦点时触发 | 组件实例 |

### Methods
| 方法名 | 说明 | 参数 |
| ---- | ---- | ---- |
| focus | 使 input 获取焦点 | - |
