import Vue from 'vue';
import { hasClass, addClass, removeClass } from 'element-ui/src/utils/dom';
import ElCheckbox from 'element-ui/packages/checkbox';
import FilterPanel from './filter-panel.vue';
import ColumnVisibilityPanel from './column-visibility-panel.vue';
import LayoutObserver from './layout-observer';
import { mapStates } from './store/helper';

const getAllColumns = (columns) => {
  const result = [];
  columns.forEach((column) => {
    if (column.children) {
      result.push(column);
      result.push.apply(result, getAllColumns(column.children));
    } else {
      // 叶子列：如果被标记隐藏，则不纳入 all 列集合
      if (!column._hidden) result.push(column);
    }
  });
  return result;
};

const convertToRows = (originColumns) => {
  let maxLevel = 1;
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1;
      if (maxLevel < column.level) {
        maxLevel = column.level;
      }
    }
    if (column.children) {
      let colSpan = 0;
      column.children.forEach((subColumn) => {
        traverse(subColumn, column);
        // 仅累加可见的子列
        if (subColumn.colSpan && subColumn.colSpan > 0) {
          colSpan += subColumn.colSpan;
        }
      });
      // if user explicitly sets colSpan, prefer it (useful for header merging)
      column.colSpan = typeof column.colSpan === 'number' && column.colSpan > 0 ? column.colSpan : colSpan;
    } else {
      // leaf column default colSpan is 1 unless user provided a positive value
      // 隐藏的叶子列 colSpan 设为 0
      if (column._hidden) {
        column.colSpan = 0;
      } else {
        column.colSpan = typeof column.colSpan === 'number' && column.colSpan > 0 ? column.colSpan : 1;
      }
    }
    // 供后续渲染行时跳过
    column._effectiveHidden = column.colSpan === 0;
  };

  originColumns.forEach((column) => {
    column.level = 1;
    traverse(column);
  });

  const rows = [];
  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  const allColumns = getAllColumns(originColumns);
  // allow user provided rowSpan for header merging; otherwise compute default
  allColumns.forEach((column) => {
    if (!column.children) {
      // 叶子列隐藏时，rowSpan=0
      const defaultSpan = (maxLevel - column.level + 1);
      column.rowSpan = typeof column.rowSpan === 'number' && column.rowSpan > 0 ? column.rowSpan : (column._hidden ? 0 : defaultSpan);
    } else {
      // 分组列若 colSpan 为 0 则认为隐藏，rowSpan=0
      const defaultSpan = 1;
      column.rowSpan = typeof column.rowSpan === 'number' && column.rowSpan > 0 ? column.rowSpan : (column._effectiveHidden ? 0 : defaultSpan);
    }
  });

  // If a parent column has a rowSpan > 1, its child header cells should be hidden
  const markHidden = (column) => {
    if (column.children && column.children.length) {
      if (column.rowSpan && column.rowSpan > 1) {
        column.children.forEach((child) => {
          child._isHiddenHeader = true;
          // still recurse to mark deeper descendants
          markHidden(child);
        });
      } else {
        column.children.forEach(markHidden);
      }
    }
  };

  originColumns.forEach(markHidden);

  allColumns.forEach((column) => {
    if (column._isHiddenHeader) return; // skip rendering this header cell
    if (column._effectiveHidden) return; // 跳过隐藏列
    rows[column.level - 1].push(column);
  });

  return rows;
};

export default {
  name: 'ElTableHeader',

  mixins: [LayoutObserver],

  render(h) {
    const originColumns = this.store.states.originColumns;
    const columnRows = convertToRows(originColumns, this.columns);
    // 是否拥有多级表头
    const isGroup = columnRows.length > 1;
    if (isGroup) this.$parent.isGroup = true;
    return (
      <table
        class="el-table__header"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {
            this.columns.map(column => <col name={ column.id } key={column.id} />)
          }
          {
            this.hasGutter ? <col name="gutter" /> : ''
          }
        </colgroup>
        <thead class={ [{ 'is-group': isGroup, 'has-gutter': this.hasGutter }] }>
          {
            this._l(columnRows, (columns, rowIndex) =>
              <tr
                style={ this.getHeaderRowStyle(rowIndex) }
                class={ this.getHeaderRowClass(rowIndex) }
              >
                {
                  columns.map((column, cellIndex) => (<th
                    colspan={ column.colSpan }
                    rowspan={ column.rowSpan }
                    on-mousemove={ ($event) => this.handleMouseMove($event, column) }
                    on-mouseout={ this.handleMouseOut }
                    on-mousedown={ ($event) => this.handleMouseDown($event, column) }
                    on-click={ ($event) => this.handleHeaderClick($event, column) }
                    on-contextmenu={ ($event) => this.handleHeaderContextMenu($event, column) }
                    style={ this.getHeaderCellStyle(rowIndex, cellIndex, columns, column) }
                    class={ this.getHeaderCellClass(rowIndex, cellIndex, columns, column) }
                    key={ column.id }>
                    <div class={ ['cell', column.filteredValue && column.filteredValue.length > 0 ? 'highlight' : '', column.labelClassName] }>
                      {
                        column.renderHeader
                          ? column.renderHeader.call(this._renderProxy, h, { column, $index: cellIndex, store: this.store, _self: this.$parent.$vnode.context })
                          : column.label
                      }
                      {
                        column.sortable ? (<span
                          class="caret-wrapper"
                          on-click={ ($event) => this.handleSortClick($event, column) }>
                          <i class="sort-caret ascending"
                            on-click={ ($event) => this.handleSortClick($event, column, 'ascending') }>
                          </i>
                          <i class="sort-caret descending"
                            on-click={ ($event) => this.handleSortClick($event, column, 'descending') }>
                          </i>
                        </span>) : ''
                      }
                      {
                        column.filterable ? (<span
                          class="el-table__column-filter-trigger"
                          on-click={ ($event) => this.handleFilterClick($event, column) }>
                          <i class={ ['el-icon-arrow-down', column.filterOpened ? 'el-icon-arrow-up' : ''] }></i>
                        </span>) : ''
                      }
                    </div>
                  </th>))
                }
                {
                  this.hasGutter ? <th class="el-table__cell gutter"></th> : ''
                }
              </tr>
            )
          }
        </thead>
      </table>
    );
  },

  props: {
    fixed: String,
    store: {
      required: true
    },
    border: Boolean,
    defaultSort: {
      type: Object,
      default() {
        return {
          prop: '',
          order: ''
        };
      }
    }
  },

  components: {
    ElCheckbox
  },

  computed: {
    table() {
      return this.$parent;
    },

    hasGutter() {
      return !this.fixed && this.tableLayout.gutterWidth;
    },

    ...mapStates({
      columns: 'columns',
      isAllSelected: 'isAllSelected',
      leftFixedLeafCount: 'fixedLeafColumnsLength',
      rightFixedLeafCount: 'rightFixedLeafColumnsLength',
      columnsCount: states => states.columns.length,
      leftFixedCount: states => states.fixedColumns.length,
      rightFixedCount: states => states.rightFixedColumns.length
    })
  },

  created() {
    this.filterPanels = {};
    this.columnVisibilityPanel = null;
  },

  mounted() {
    // nextTick 是有必要的 https://github.com/ElemeFE/element/pull/11311
    this.$nextTick(() => {
      const { prop, order } = this.defaultSort;
      const init = true;
      this.store.commit('sort', { prop, order, init });
    });
  },

  beforeDestroy() {
    const panels = this.filterPanels;
    for (let prop in panels) {
      if (panels.hasOwnProperty(prop) && panels[prop]) {
        panels[prop].$destroy(true);
      }
    }
  },

  methods: {
    handleOperatorClick(event, column) {
      event.stopPropagation();
      const target = event.target;
      let cell = target.tagName === 'TH' ? target : target.parentNode;
      if (hasClass(cell, 'noclick')) return;
      const trigger = cell.querySelector('.el-table__column-visibility-trigger') || cell;
      const table = this.$parent;

      let panel = this.columnVisibilityPanel;
      if (panel && panel.showPopper) {
        panel.showPopper = false;
        return;
      }

      if (!panel) {
        panel = new Vue(ColumnVisibilityPanel);
        this.columnVisibilityPanel = panel;
        panel.table = table;
        panel.cell = trigger;
        !this.$isServer && panel.$mount(document.createElement('div'));
      } else {
        panel.cell = trigger;
        panel.referenceElm = trigger;
      }

      setTimeout(() => {
        panel.showPopper = true;
      }, 16);
    },
    isCellHidden(index, columns) {
      let start = 0;
      for (let i = 0; i < index; i++) {
        start += columns[i].colSpan;
      }
      const after = start + columns[index].colSpan - 1;
      if (this.fixed === true || this.fixed === 'left') {
        return after >= this.leftFixedLeafCount;
      } else if (this.fixed === 'right') {
        return start < this.columnsCount - this.rightFixedLeafCount;
      } else {
        return (after < this.leftFixedLeafCount) || (start >= this.columnsCount - this.rightFixedLeafCount);
      }
    },

    getHeaderRowStyle(rowIndex) {
      const headerRowStyle = this.table.headerRowStyle;
      if (typeof headerRowStyle === 'function') {
        return headerRowStyle.call(null, { rowIndex });
      }
      return headerRowStyle;
    },

    getHeaderRowClass(rowIndex) {
      const classes = [];

      const headerRowClassName = this.table.headerRowClassName;
      if (typeof headerRowClassName === 'string') {
        classes.push(headerRowClassName);
      } else if (typeof headerRowClassName === 'function') {
        classes.push(headerRowClassName.call(null, { rowIndex }));
      }

      return classes.join(' ');
    },

    getHeaderCellStyle(rowIndex, columnIndex, row, column) {
      const headerCellStyle = this.table.headerCellStyle;
      if (typeof headerCellStyle === 'function') {
        return headerCellStyle.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        });
      }
      return headerCellStyle;
    },

    getHeaderCellClass(rowIndex, columnIndex, row, column) {
      const classes = [column.id, column.order, column.headerAlign, column.className, column.labelClassName];

      if (column._hiddenHeader) {
        classes.push('is-hidden-header');
      }

      if (rowIndex === 0 && this.isCellHidden(columnIndex, row)) {
        classes.push('is-hidden');
      }

      if (!column.children) {
        classes.push('is-leaf');
      }

      if (column.sortable) {
        classes.push('is-sortable');
      }

      // 当前高亮列
      if (this.table.highlightCurrentColumn && !this.table.suspendCurrentColumnHighlight && column === this.store.states.currentColumn) {
        classes.push('current-column');
      }

      // 添加列级边框样式类
      if (column.borderConfig) {
        const borderConfig = column.borderConfig;
        const tableBorder = this.border || this.table.isGroup;

        // 如果表格没有边框，直接添加需要的边框
        if (!tableBorder) {
          if (borderConfig.top === true) classes.push('el-table__cell--border-top');
          if (borderConfig.right === true) classes.push('el-table__cell--border-right');
          if (borderConfig.bottom === true) classes.push('el-table__cell--border-bottom');
          if (borderConfig.left === true) classes.push('el-table__cell--border-left');
        } else {
          // 如果表格有边框，需要考虑覆盖默认边框
          const keepHeader = !!column.keepHeaderBorder;
          if (borderConfig.top === true) {
            classes.push('el-table__cell--border-top');
          } else if (borderConfig.top === false && !keepHeader) {
            classes.push('el-table__cell--no-border-top');
          }

          if (borderConfig.right === true) {
            classes.push('el-table__cell--border-right');
          } else if (borderConfig.right === false && !keepHeader) {
            classes.push('el-table__cell--no-border-right');
          }

          if (borderConfig.bottom === true) {
            classes.push('el-table__cell--border-bottom');
          } else if (borderConfig.bottom === false && !keepHeader) {
            classes.push('el-table__cell--no-border-bottom');
          }

          if (borderConfig.left === true) {
            classes.push('el-table__cell--border-left');
          } else if (borderConfig.left === false && !keepHeader) {
            classes.push('el-table__cell--no-border-left');
          }
        }
      }

      const headerCellClassName = this.table.headerCellClassName;
      if (typeof headerCellClassName === 'string') {
        classes.push(headerCellClassName);
      } else if (typeof headerCellClassName === 'function') {
        classes.push(headerCellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        }));
      }

      classes.push('el-table__cell');

      return classes.join(' ');
    },

    toggleAllSelection() {
      this.store.commit('toggleAllSelection');
    },

    handleFilterClick(event, column) {
      event.stopPropagation();
      const target = event.target;
      let cell = target.tagName === 'TH' ? target : target.parentNode;
      if (hasClass(cell, 'noclick')) return;
      cell = cell.querySelector('.el-table__column-filter-trigger') || cell;
      const table = this.$parent;

      let filterPanel = this.filterPanels[column.id];

      if (filterPanel && column.filterOpened) {
        filterPanel.showPopper = false;
        return;
      }

      if (!filterPanel) {
        filterPanel = new Vue(FilterPanel);
        this.filterPanels[column.id] = filterPanel;
        if (column.filterPlacement) {
          filterPanel.placement = column.filterPlacement;
        }
        filterPanel.table = table;
        filterPanel.cell = cell;
        filterPanel.column = column;
        !this.$isServer && filterPanel.$mount(document.createElement('div'));
      }

      setTimeout(() => {
        filterPanel.showPopper = true;
      }, 16);
    },

    handleHeaderClick(event, column) {
      if (!column.filters && column.sortable) {
        this.handleSortClick(event, column);
      } else if (column.filterable && !column.sortable) {
        this.handleFilterClick(event, column);
      } else if (column.isColumnOperator) {
        this.handleOperatorClick(event, column);
      }

      this.$parent.$emit('header-click', column, event);
    },

    handleHeaderContextMenu(event, column) {
      this.$parent.$emit('header-contextmenu', column, event);
    },

    handleMouseDown(event, column) {
      if (this.$isServer) return;
      if (column.children && column.children.length > 0) return;
      /* istanbul ignore if */
      if (this.draggingColumn && this.border) {
        this.dragging = true;

        this.$parent.resizeProxyVisible = true;

        const table = this.$parent;
        const tableEl = table.$el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const columnEl = this.$el.querySelector(`th.${column.id}`);
        const columnRect = columnEl.getBoundingClientRect();
        const minLeft = columnRect.left - tableLeft + 30;

        addClass(columnEl, 'noclick');

        this.dragState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft
        };

        const resizeProxy = table.$refs.resizeProxy;
        resizeProxy.style.left = this.dragState.startLeft + 'px';

        document.onselectstart = function() { return false; };
        document.ondragstart = function() { return false; };

        const handleMouseMove = (event) => {
          const deltaLeft = event.clientX - this.dragState.startMouseLeft;
          const proxyLeft = this.dragState.startLeft + deltaLeft;

          resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
        };

        const handleMouseUp = () => {
          if (this.dragging) {
            const {
              startColumnLeft,
              startLeft
            } = this.dragState;
            const finalLeft = parseInt(resizeProxy.style.left, 10);
            const columnWidth = finalLeft - startColumnLeft;
            column.width = column.realWidth = columnWidth;
            table.$emit('header-dragend', column.width, startLeft - startColumnLeft, column, event);

            this.store.scheduleLayout();

            document.body.style.cursor = '';
            this.dragging = false;
            this.draggingColumn = null;
            this.dragState = {};

            table.resizeProxyVisible = false;
          }

          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.onselectstart = null;
          document.ondragstart = null;

          setTimeout(function() {
            removeClass(columnEl, 'noclick');
          }, 0);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    },

    handleMouseMove(event, column) {
      if (column.children && column.children.length > 0) return;
      let target = event.target;
      while (target && target.tagName !== 'TH') {
        target = target.parentNode;
      }

      if (!column || !column.resizable) return;

      if (!this.dragging && this.border) {
        let rect = target.getBoundingClientRect();

        const bodyStyle = document.body.style;
        if (rect.width > 12 && rect.right - event.pageX < 8) {
          bodyStyle.cursor = 'col-resize';
          if (hasClass(target, 'is-sortable')) {
            target.style.cursor = 'col-resize';
          }
          this.draggingColumn = column;
        } else if (!this.dragging) {
          bodyStyle.cursor = '';
          if (hasClass(target, 'is-sortable')) {
            target.style.cursor = 'pointer';
          }
          this.draggingColumn = null;
        }
      }
    },

    handleMouseOut() {
      if (this.$isServer) return;
      document.body.style.cursor = '';
    },

    toggleOrder({ order, sortOrders }) {
      if (order === '') return sortOrders[0];
      const index = sortOrders.indexOf(order || null);
      return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1];
    },

    handleSortClick(event, column, givenOrder) {
      event.stopPropagation();
      let order = column.order === givenOrder
        ? null
        : (givenOrder || this.toggleOrder(column));

      let target = event.target;
      while (target && target.tagName !== 'TH') {
        target = target.parentNode;
      }

      if (target && target.tagName === 'TH') {
        if (hasClass(target, 'noclick')) {
          removeClass(target, 'noclick');
          return;
        }
      }

      if (!column.sortable) return;

      const states = this.store.states;
      let sortProp = states.sortProp;
      let sortOrder;
      const sortingColumn = states.sortingColumn;

      if (sortingColumn !== column || (sortingColumn === column && sortingColumn.order === null)) {
        if (sortingColumn) {
          sortingColumn.order = null;
        }
        states.sortingColumn = column;
        sortProp = column.property;
      }

      if (!order) {
        sortOrder = column.order = null;
      } else {
        sortOrder = column.order = order;
      }

      states.sortProp = sortProp;
      states.sortOrder = sortOrder;

      this.store.commit('changeSortCondition');
    }
  },

  data() {
    return {
      draggingColumn: null,
      dragging: false,
      dragState: {}
    };
  }
};
