<template>
  <transition name="el-zoom-in-top">
    <div
      class="el-table-column-visibility"
      v-clickoutside="handleOutsideClick"
      v-show="showPopper">
      <div class="el-table-column-visibility__content">
        <el-scrollbar wrap-class="el-table-column-visibility__wrap">
          <ul class="el-table-column-visibility__list">
            <li
              v-for="col in toggleableColumns"
              :key="col.id"
              class="el-table-column-visibility__item">
              <el-checkbox v-model="colVisibleMap[col.id]" @change="onToggle(col)">
                {{ col.label || col.property || col.prop || col.columnKey || col.id }}
              </el-checkbox>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div class="el-table-column-visibility__bottom">
        <button @click="showAll">全选</button>
        <button @click="hideAll">全不选</button>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  import Popper from 'element-ui/src/utils/vue-popper';
  import { PopupManager } from 'element-ui/src/utils/popup';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import ElScrollbar from 'element-ui/packages/scrollbar';
  import ElCheckbox from 'element-ui/packages/checkbox';

  export default {
    name: 'ElTableColumnVisibilityPanel',

    mixins: [Popper],

    directives: { Clickoutside },

    components: { ElScrollbar, ElCheckbox },

    props: {
      placement: { type: String, default: 'bottom-end' }
    },

    data() {
      return {
        table: null,
        cell: null,
        showPopper: false,
        colVisibleMap: {}
      };
    },

    computed: {
      columns() {
        return (this.table && this.table.store && this.table.store.states && this.table.store.states.originColumns) || [];
      },
      toggleableColumns() {
        const all = [];
        const traverse = (cols) => {
          (cols || []).forEach(c => {
            if (c.children && c.children.length) {
              traverse(c.children);
            } else {
              // 叶子列：排除操作列与静态列
              if (!c.isColumnOperator && !c.staticColumn) all.push(c);
            }
          });
        };
        traverse(this.columns);
        // 初始化 map
        const map = {};
        all.forEach(c => { map[c.id] = !c._hidden; });
        this.colVisibleMap = map;
        return all;
      }
    },

    methods: {
      handleOutsideClick() {
        setTimeout(() => { this.showPopper = false; }, 16);
      },
      onToggle(col) {
        const visible = !!this.colVisibleMap[col.id];
        this.applyVisibility(col, visible);
      },
      applyVisibility(col, visible) {
        col._hidden = !visible;
        // 变更后，重新布局
        this.table.store.scheduleLayout(true);
        this.table.$emit('column-visibility-change', { column: col, visible });
      },
      showAll() {
        this.toggleableColumns.forEach(c => { this.colVisibleMap[c.id] = true; c._hidden = false; });
        this.table.store.scheduleLayout(true);
        this.table.$emit('column-visibility-change', { all: true, visible: true });
      },
      hideAll() {
        this.toggleableColumns.forEach(c => { this.colVisibleMap[c.id] = false; c._hidden = true; });
        this.table.store.scheduleLayout(true);
        this.table.$emit('column-visibility-change', { all: true, visible: false });
      }
    },

    mounted() {
      this.popperElm = this.$el;
      this.referenceElm = this.cell;
      this.table.bodyWrapper.addEventListener('scroll', () => { this.updatePopper(); });

      this.$watch('showPopper', (value) => {
        if (value && this.popperJS && this.popperJS._popper) {
          if (parseInt(this.popperJS._popper.style.zIndex, 10) < PopupManager.zIndex) {
            this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
          }
        }
      });
    }
  };
</script>
