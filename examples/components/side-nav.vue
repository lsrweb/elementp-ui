<style lang="scss">
/* ============================================================
   Sidebar — Doc Side Navigation
   All classes prefixed .doc-sidenav to avoid el- conflicts
   ============================================================ */

:root {
  --nav-bg:           #ffffff;
  --nav-border:       #e6e8eb;
  --nav-text:         #4a5260;
  --nav-text-hover:   #5b6af0;
  --nav-text-active:  #5b6af0;
  --nav-active-bg:    #eff1ff;
  --nav-active-bar:   #5b6af0;
  --nav-group-title:  #8d95a3;
  --nav-hover-bg:     rgba(91,106,240,.06);
  --nav-section:      #18191c;
  --nav-highlight:    #5b6af0;
  --nav-search-bg:    #f5f7fc;
  --nav-search-border:#e6e8eb;
  --nav-search-input: #4a5260;
  --nav-scrollbar-thumb: rgba(0,0,0,.15);
}

/* ---- Container ---- */
.doc-sidenav {
  width: 100%;
  height: 100%;
  background: var(--nav-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: opacity .3s;

  &.is-fade {
    opacity: .45;
    transition: opacity 3s;
  }
}

/* ---- Search Box ---- */
.doc-sidenav__search-wrap {
  padding: 14px 14px 10px;
  flex-shrink: 0;
  background: var(--nav-bg);
  border-bottom: 1px solid var(--nav-border);
}

.doc-sidenav__search {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--nav-search-bg);
  border: 1px solid var(--nav-search-border);
  border-radius: 8px;
  padding: 0 10px;
  gap: 6px;
  transition: border-color .2s, background .2s;

  &:focus-within {
    border-color: var(--nav-active-bar);
    background: rgba(91,106,240,.08);
  }
}

.doc-sidenav__search-icon {
  font-size: 13px;
  color: var(--nav-group-title);
  flex-shrink: 0;
}

.doc-sidenav__search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  height: 34px;
  font-size: 13px;
  color: var(--nav-search-input, var(--nav-text-hover));
  padding: 0;
  min-width: 0;

  &::placeholder {
    color: var(--nav-group-title);
  }
}

.doc-sidenav__search-clear {
  font-size: 12px;
  color: var(--nav-group-title);
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
  flex-shrink: 0;
  transition: color .15s;

  &:hover {
    color: var(--nav-text-hover);
  }
}

/* ---- Scroll area ---- */
.doc-sidenav__scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0 64px;
  scrollbar-width: thin;
  scrollbar-color: var(--nav-scrollbar-thumb) transparent;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--nav-scrollbar-thumb);
    border-radius: 2px;
  }
}

/* ---- Empty state ---- */
.doc-sidenav__empty {
  padding: 28px 20px;
  font-size: 13px;
  color: var(--nav-group-title);
  text-align: center;
}

/* ---- List reset ---- */
.doc-sidenav__list,
.doc-sidenav__sublist {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ---- Section label ("开发指南", "组件") ---- */
.doc-sidenav__section {
  display: block;
  padding: 18px 18px 4px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--nav-section);
  user-select: none;
}

/* ---- Link (all nav items) ---- */
.doc-sidenav__link {
  display: flex;
  align-items: center;
  padding: 0 14px 0 18px;
  height: 33px;
  font-size: 13.5px;
  color: var(--nav-text);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color .15s, background .15s, border-color .15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    color: var(--nav-text-hover);
    background: var(--nav-hover-bg);
    border-left-color: rgba(91,106,240,.25);
  }

  &.is-active {
    color: var(--nav-text-active);
    background: var(--nav-active-bg);
    border-left-color: var(--nav-active-bar);
    font-weight: 500;

    mark {
      color: #ffffff;
    }
  }

  .doc-sidenav__ext-icon {
    margin-left: auto;
    font-size: 11px;
    opacity: .35;
  }
}

/* ---- Group header ---- */
.doc-sidenav__group {
  margin-top: 2px;
}

.doc-sidenav__group-title {
  padding: 12px 18px 4px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--nav-group-title);
  user-select: none;
}

/* ---- Search highlight ---- */
mark {
  background: transparent;
  color: var(--nav-highlight);
  font-weight: 600;
}

/* ---- Mobile ---- */
@media (max-width: 768px) {
  .doc-sidenav {
    height: auto;
  }
}
</style>

<template>
  <div
    class="doc-sidenav"
    @mouseenter="isFade = false"
    :class="{ 'is-fade': isFade }">

    <!-- ① Search / Filter -->
    <div class="doc-sidenav__search-wrap">
      <div class="doc-sidenav__search">
        <i class="el-icon-search doc-sidenav__search-icon"></i>
        <input
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          class="doc-sidenav__search-input"
          type="text"
          autocomplete="off"
        />
        <i
          v-if="searchQuery"
          class="el-icon-close doc-sidenav__search-clear"
          @click="searchQuery = ''">
        </i>
      </div>
    </div>

    <!-- ② Nav tree -->
    <div class="doc-sidenav__scroll">
      <div v-if="searchQuery && !hasResults" class="doc-sidenav__empty">
        {{ noResultText }}
      </div>

      <ul class="doc-sidenav__list">
        <li v-for="(item, i) in filteredData" :key="i">

          <!-- External link -->
          <a
            v-if="item.href"
            :href="item.href"
            target="_blank"
            class="doc-sidenav__link">
            <span v-html="highlight(item.name)"></span>
            <i class="el-icon-top-right doc-sidenav__ext-icon"></i>
          </a>

          <!-- Route link -->
          <router-link
            v-else-if="item.path"
            :to="base + item.path"
            active-class="is-active"
            class="doc-sidenav__link"
            exact>
            <span v-html="highlight(item.title || item.name)"></span>
          </router-link>

          <!-- Section heading (no path, no groups) -->
          <span
            v-else-if="!item.groups && !item.children"
            class="doc-sidenav__section">
            {{ item.name }}
          </span>

          <!-- Children sub-nav -->
          <template v-if="item.children">
            <ul class="doc-sidenav__sublist">
              <li v-for="(child, j) in item.children" :key="j">
                <router-link
                  :to="base + child.path"
                  active-class="is-active"
                  class="doc-sidenav__link"
                  exact>
                  <span v-html="highlight(child.title || child.name)"></span>
                </router-link>
              </li>
            </ul>
          </template>

          <!-- Groups (component section) -->
          <template v-if="item.groups">
            <div
              v-for="(group, k) in item.groups"
              :key="k"
              class="doc-sidenav__group">
              <div class="doc-sidenav__group-title">{{ group.groupName }}</div>
              <ul class="doc-sidenav__sublist">
                <li
                  v-for="(navItem, m) in group.list"
                  v-show="!navItem.disabled"
                  :key="m">
                  <router-link
                    :to="base + navItem.path"
                    active-class="is-active"
                    class="doc-sidenav__link"
                    exact>
                    <span v-html="highlight(navItem.title)"></span>
                  </router-link>
                </li>
              </ul>
            </div>
          </template>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import bus from '../bus';

  export default {
    props: {
      data: Array,
      base: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        searchQuery: '',
        isFade: false
      };
    },

    computed: {
      lang() {
        return this.$route.meta.lang;
      },

      searchPlaceholder() {
        return {
          'zh-CN': '搜索组件...',
          'en-US': 'Search components...',
          'es': 'Buscar componentes...',
          'fr-FR': 'Rechercher...'
        }[this.lang] || '搜索组件...';
      },

      noResultText() {
        return {
          'zh-CN': '没有找到匹配的组件',
          'en-US': 'No components found',
          'es': 'No se encontraron componentes',
          'fr-FR': 'Aucun composant trouvé'
        }[this.lang] || '没有找到匹配的组件';
      },

      filteredData() {
        const q = (this.searchQuery || '').trim().toLowerCase();
        if (!q) return this.data;

        return (this.data || []).reduce((acc, item) => {
          // Simple top-level items (links / external)
          if (!item.groups && !item.children) {
            if ((item.name || item.title || '').toLowerCase().includes(q)) {
              acc.push(item);
            }
            return acc;
          }
          // Items with children
          if (item.children) {
            const children = item.children.filter(c =>
              (c.name || c.title || '').toLowerCase().includes(q)
            );
            if (children.length) acc.push({ ...item, children });
            return acc;
          }
          // Items with groups (main component section)
          if (item.groups) {
            const groups = item.groups.reduce((gs, group) => {
              const list = group.list.filter(nav =>
                !nav.disabled &&
                (nav.title || '').toLowerCase().includes(q)
              );
              if (list.length) gs.push({ ...group, list });
              return gs;
            }, []);
            if (groups.length) acc.push({ ...item, groups });
          }
          return acc;
        }, []);
      },

      hasResults() {
        return this.filteredData && this.filteredData.length > 0;
      }
    },

    methods: {
      highlight(text) {
        if (!text) return text || '';
        const q = (this.searchQuery || '').trim();
        if (!q) return text;
        const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(`(${esc})`, 'gi'), '<mark>$1</mark>');
      }
    },

    watch: {
      isFade(val) {
        bus.$emit('navFade', val);
      }
    },

    created() {
      bus.$on('fadeNav', () => {
        this.isFade = true;
      });
    }
  };
</script>
