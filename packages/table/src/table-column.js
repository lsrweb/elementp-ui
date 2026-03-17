import { cellStarts, cellForced, defaultRenderCell, treeCellPrefix } from './config';
import { mergeOptions, parseWidth, parseMinWidth, compose } from './util';
import ElCheckbox from 'element-ui/packages/checkbox';

let columnIdSeed = 1;

export default {
  name: 'ElTableColumn',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    // 新增：隐藏表头（仅隐藏 header 文本与单元格），内容自动顶上
    hiddenHeader: Boolean,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [Boolean, String],
      default: false
    },
    headerColspan: {
      type: Number
    },
    headerRowspan: {
      type: Number
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: Boolean,
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default() {
        return ['ascending', 'descending', null];
      },
      validator(val) {
        return val.every(order => ['ascending', 'descending', null].indexOf(order) > -1);
      }
    },
    // 列级 border 控制。优先级高于 Table 的 border。
    // 支持：
    //  true / 'right'  -> 只渲染右侧竖线
    //  'left'          -> 只渲染左侧竖线（表格未开 border 也会显示）
    //  'both'          -> 渲染左右竖线
    //  false / 'none'  -> 去掉该列右侧竖线（表格开了 border 也移除），左侧保持默认
    //  undefined       -> 跟随表格整体 border
    //  对象形式        -> { top: true, right: true, bottom: true, left: true }
    //  字符串形式      -> 'top right bottom left' (用空格分隔)
    border: {
      type: [Boolean, String, Object],
      required: false
    },
    // 是否保持表头单元格原始边框（当 border 配置中去掉某些边框时，表体去掉，表头保留）
    keepHeaderBorder: {
      type: Boolean,
      default: false
    },
    // 是否为列操作入口列（在表头展示列显隐控制）
    columnOperator: {
      type: Boolean,
      default: false
    },
    // 静态列：不可隐藏，且不出现在列操作面板
    staticColumn: {
      type: Boolean,
      default: false
    },
    // 默认隐藏该列
    defaultHidden: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isSubColumn: false,
      columns: []
    };
  },

  computed: {
    owner() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },

    columnOrTableParent() {
      let parent = this.$parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.$parent;
      }
      return parent;
    },

    realWidth() {
      return parseWidth(this.width);
    },

    realMinWidth() {
      return parseMinWidth(this.minWidth);
    },

    realAlign() {
      return this.align ? 'is-' + this.align : null;
    },

    realHeaderAlign() {
      return this.headerAlign ? 'is-' + this.headerAlign : this.realAlign;
    },

    // 解析列边框配置
    borderConfig() {
      if (this.border === undefined || this.border === null) {
        return null; // 跟随表格整体 border
      }

      const config = { top: null, right: null, bottom: null, left: null };

      if (typeof this.border === 'boolean') {
        if (this.border) {
          config.right = true; // true 默认只显示右边框
        } else {
          config.right = false; // false 明确移除右边框
        }
      } else if (typeof this.border === 'string') {
        const borderStr = this.border.toLowerCase();
        if (borderStr === 'right' || borderStr === '') {
          config.right = true;
        } else if (borderStr === 'left') {
          config.left = true;
        } else if (borderStr === 'both') {
          config.left = true;
          config.right = true;
        } else if (borderStr === 'none') {
          // 明确移除所有边框
          config.top = false;
          config.right = false;
          config.bottom = false;
          config.left = false;
        } else {
          // 解析 'top right bottom left' 格式
          const parts = borderStr.split(/\s+/);
          parts.forEach(part => {
            if (part === 'top') config.top = true;
            else if (part === 'right') config.right = true;
            else if (part === 'bottom') config.bottom = true;
            else if (part === 'left') config.left = true;
          });
        }
      } else if (typeof this.border === 'object') {
        // 对象形式 { top: true, right: true, bottom: true, left: true }
        // 明确设置为 false 的会被标记为需要移除，undefined/null 则保持默认
        config.top = this.border.hasOwnProperty('top') ? !!this.border.top : null;
        config.right = this.border.hasOwnProperty('right') ? !!this.border.right : null;
        config.bottom = this.border.hasOwnProperty('bottom') ? !!this.border.bottom : null;
        config.left = this.border.hasOwnProperty('left') ? !!this.border.left : null;
      }

      return config;
    }
  },

  methods: {
    getPropsData(...props) {
      return props.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
          cur.forEach((key) => {
            prev[key] = this[key];
          });
        }
        return prev;
      }, {});
    },

    getColumnElIndex(children, child) {
      return [].indexOf.call(children, child);
    },

    setColumnWidth(column) {
      if (this.realWidth) {
        column.width = this.realWidth;
      }
      if (this.realMinWidth) {
        column.minWidth = this.realMinWidth;
      }
      if (!column.minWidth) {
        column.minWidth = 80;
      }
      column.realWidth = column.width === undefined ? column.minWidth : column.width;
      return column;
    },

    setColumnForcedProps(column) {
      // 对于特定类型的 column，某些属性不允许设置
      const type = column.type;
      const source = cellForced[type] || {};
      Object.keys(source).forEach(prop => {
        let value = source[prop];
        if (value !== undefined) {
          column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value;
        }
      });
      return column;
    },

    setColumnRenders(column) {
      // renderHeader 属性不推荐使用。
      if (this.renderHeader) {
        console.warn('[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.');
      } else if (column.type !== 'selection') {
        column.renderHeader = (h, scope) => {
          const renderHeader = this.$scopedSlots.header;
          // 若为列操作入口，则在 header 中渲染触发器图标
          if (this.columnOperator) {
            const labelVNode = renderHeader ? renderHeader(scope) : (column.label || '');
            return (
              <div class="el-table__column-operator">
                <span class="el-table__column-operator-label">{ labelVNode }</span>
                <span class="el-table__column-visibility-trigger el-icon-setting"></span>
              </div>
            );
          }
          return renderHeader ? renderHeader(scope) : column.label;
        };
      }

      let originRenderCell = column.renderCell;
      // TODO: 这里的实现调整
      if (column.type === 'expand') {
        // 对于展开行，renderCell 不允许配置的。在上一步中已经设置过，这里需要简单封装一下。
        column.renderCell = (h, data) => (<div class="cell">
          { originRenderCell(h, data) }
        </div>);
        this.owner.renderExpanded = (h, data) => {
          return this.$scopedSlots.default
            ? this.$scopedSlots.default(data)
            : this.$slots.default;
        };
      } else {
        originRenderCell = originRenderCell || defaultRenderCell;
        // 对 renderCell 进行包装
        column.renderCell = (h, data) => {
          let children = null;
          if (this.$scopedSlots.default) {
            children = this.$scopedSlots.default(data);
          } else {
            children = originRenderCell(h, data);
          }
          const prefix = treeCellPrefix(h, data);
          const props = {
            class: 'cell',
            style: {}
          };
          if (column.showOverflowTooltip) {
            props.class += ' el-tooltip';
            props.style = {width: (data.column.realWidth || data.column.width) - 1 + 'px'};
          }
          return (<div { ...props }>
            { prefix }
            { children }
          </div>);
        };
      }
      return column;
    },

    registerNormalWatchers() {
      const props = ['label', 'property', 'filters', 'filterMultiple', 'sortable', 'index', 'formatter', 'className', 'labelClassName', 'showOverflowTooltip', 'headerColspan', 'headerRowspan', 'hiddenHeader', 'border', 'keepHeaderBorder'];
      // 一些属性具有别名
      const aliases = {
        prop: 'property',
        realAlign: 'align',
        realHeaderAlign: 'headerAlign',
        realWidth: 'width',
        headerColspan: 'colSpan',
        headerRowspan: 'rowSpan'
      };
      const allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
      }, aliases);

      Object.keys(allAliases).forEach(key => {
        const columnKey = aliases[key];
        this.$watch(key, (newVal) => {
          this.columnConfig[columnKey] = newVal;
        });
      });

      // 监听边框配置变化
      this.$watch('borderConfig', (newVal) => {
        this.columnConfig.borderConfig = newVal;
      }, { deep: true });
    },

    registerComplexWatchers() {
      const props = ['fixed'];
      const aliases = {
        realWidth: 'width',
        realMinWidth: 'minWidth'
      };
      const allAliases = props.reduce((prev, cur) => {
        prev[cur] = cur;
        return prev;
      }, aliases);

      Object.keys(allAliases).forEach(key => {
        const columnKey = aliases[key];

        this.$watch(key, (newVal) => {
          this.columnConfig[columnKey] = newVal;
          const updateColumns = columnKey === 'fixed';
          this.owner.store.scheduleLayout(updateColumns);
        });
      });
    }
  },

  components: {
    ElCheckbox
  },

  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
    this.columnId = '';
  },

  created() {
    const parent = this.columnOrTableParent;
    this.isSubColumn = this.owner !== parent;
    this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++;

    const type = this.type || 'default';
    const sortable = this.sortable === '' ? true : this.sortable;
    const defaults = {
      ...cellStarts[type],
      id: this.columnId,
      type: type,
      property: this.prop || this.property,
      align: this.realAlign,
      headerAlign: this.realHeaderAlign,
      showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
      // filter 相关属性
      filterable: this.filters || this.filterMethod,
      filteredValue: [],
      filterPlacement: '',
      isColumnGroup: false,
      filterOpened: false,
      // sort 相关属性
      sortable: sortable,
      // index 列
      index: this.index
    };

    const basicProps = ['columnKey', 'label', 'className', 'labelClassName', 'type', 'renderHeader', 'formatter', 'fixed', 'resizable'];
    const sortProps = ['sortMethod', 'sortBy', 'sortOrders'];
    const selectProps = ['selectable', 'reserveSelection'];
    const filterProps = ['filterMethod', 'filters', 'filterMultiple', 'filterOpened', 'filteredValue', 'filterPlacement'];

    let column = this.getPropsData(basicProps, sortProps, selectProps, filterProps);
    column = mergeOptions(defaults, column);

    // 添加边框配置
    column.borderConfig = this.borderConfig;
    column.keepHeaderBorder = this.keepHeaderBorder;

    // 列显示/隐藏：标记与默认值
    column.isColumnOperator = !!this.columnOperator;
    column.staticColumn = !!this.staticColumn;
    column._hidden = !!this.defaultHidden && !column.staticColumn && !column.isColumnOperator;

    if (this.hiddenHeader) {
      column._hiddenHeader = true;
    }

    // 注意 compose 中函数执行的顺序是从右到左
    const chains = compose(this.setColumnRenders, this.setColumnWidth, this.setColumnForcedProps);
    column = chains(column);

    // 支持通过 headerColspan/headerRowspan 在创建阶段设置 header 的合并
    if (typeof this.headerColspan === 'number' && this.headerColspan > 0) {
      column.colSpan = this.headerColspan;
    }

    if (typeof this.headerRowspan === 'number' && this.headerRowspan > 0) {
      column.rowSpan = this.headerRowspan;
    }

    this.columnConfig = column;

    // 注册 watcher
    this.registerNormalWatchers();
    this.registerComplexWatchers();
  },

  mounted() {
    const owner = this.owner;
    const parent = this.columnOrTableParent;
    const children = this.isSubColumn ? parent.$el.children : parent.$refs.hiddenColumns.children;
    const columnIndex = this.getColumnElIndex(children, this.$el);

    owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  },

  destroyed() {
    if (!this.$parent) return;
    const parent = this.$parent;
    this.owner.store.commit('removeColumn', this.columnConfig, this.isSubColumn ? parent.columnConfig : null);
  },

  render(h) {
    // slots 也要渲染，需要计算合并表头
    return h('div', this.$slots.default);
  }
};
