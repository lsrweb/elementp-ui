<template>
  <el-autocomplete
    v-model="query"
    class="doc-search"
    size="small"
    :popper-class="`doc-search-dropdown${isEmpty ? ' is-empty' : ''}`"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    :trigger-on-focus="false"
    @select="handleSelect"
    highlight-first-item
  >
    <!-- 搜索图标前缀 -->
    <i slot="prefix" class="el-icon-search doc-search__icon"></i>
    <!-- 键盘快捷键提示 -->
    <span slot="suffix" class="doc-search__kbd" v-if="!query">
      <kbd>/</kbd>
    </span>
    <template slot-scope="props">
      <p class="doc-search-title" v-if="props.item.title">
        <span
          class="doc-search-compo"
          v-html="props.item.highlightedCompo"
        ></span>
        <i class="el-icon-arrow-right doc-search-sep"></i>
        <span v-html="props.item.title"></span>
      </p>
      <p
        class="doc-search-content"
        v-if="props.item.content"
        v-html="props.item.content"
      ></p>
      <a
        class="doc-search-algolia"
        v-if="props.item.img"
        target="_blank"
        href="https://www.algolia.com/docsearch"
      >
        <img
          class="doc-search-algolia__logo"
          src="../assets/images/search-by-algolia.svg"
          alt="algolia"
        />
      </a>
      <p class="doc-search-empty" v-if="props.item.isEmpty">{{ emptyText }}</p>
    </template>
  </el-autocomplete>
</template>

<style lang="scss">
/* ============ Input ============ */
.doc-search {
  width: 200px !important;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-focus,
  &:focus-within {
    width: 280px !important;
  }

  .el-input__inner {
    height: 34px;
    line-height: 34px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #f5f6f8;
    font-size: 13px;
    padding-left: 34px;
    padding-right: 36px;
    color: #18191c;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;

    &::placeholder {
      color: #8d95a3;
    }

    &:focus {
      background: #fff;
      border-color: #5b6af0;
      box-shadow: 0 0 0 3px rgba(91, 106, 240, 0.14);
      outline: none;
    }
  }

  .el-input__prefix {
    left: 10px;
    display: flex;
    align-items: center;
  }

  .el-input__suffix {
    right: 10px;
    display: flex;
    align-items: center;
  }
}

.doc-search__icon {
  font-size: 14px;
  color: #8d95a3;
  line-height: 1;
}

.doc-search__kbd {
  display: flex;
  align-items: center;

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-size: 11px;
    color: #8d95a3;
    background: #e8eaee;
    border: 1px solid #d0d3da;
    border-radius: 4px;
    padding: 0 5px;
    height: 18px;
    line-height: 1;
    box-shadow: 0 1px 0 #c0c3ca;
  }
}

/* ============ Dropdown ============ */
.doc-search-dropdown {
  width: 420px !important;
  border-radius: 12px !important;
  overflow: hidden;
  border: 1px solid #e2e6ef !important;
  box-shadow: 0 8px 32px rgba(15, 20, 40, 0.15) !important;
  margin-top: 6px !important;

  &.is-empty .el-autocomplete-suggestion__list {
    padding-bottom: 0 !important;
  }

  .el-autocomplete-suggestion__wrap {
    padding: 6px 0 !important;
    max-height: 420px;
  }

  .el-autocomplete-suggestion__list {
    padding-bottom: 32px !important;
  }

  li {
    border: none !important;
    margin: 2px 6px;
    border-radius: 8px;
    padding: 8px 12px !important;
    line-height: normal;
    transition: background 0.12s;

    &:hover,
    &.highlighted {
      background: #f0f3ff !important;
    }
  }

  /* highlight (algolia) */
  .algolia-highlight {
    color: #5b6af0;
    font-weight: 700;
    background: rgba(91, 106, 240, 0.1);
    border-radius: 3px;
    padding: 0 2px;
  }

  /* result title row */
  .doc-search-title {
    margin: 0 0 4px;
    font-size: 13.5px;
    line-height: 1.5;
    color: #18191c;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
  }

  .doc-search-compo {
    color: #5b6af0;
    font-weight: 600;
  }

  .doc-search-sep {
    font-size: 10px;
    color: #8d95a3;
    flex-shrink: 0;
  }

  /* excerpt */
  .doc-search-content {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* algolia logo bar */
  .doc-search-algolia {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 6px 14px;
    background: #f7f8fc;
    border-top: 1px solid #edf0f5;
    box-sizing: border-box;

    &:hover {
      background: #f7f8fc;
    }

    &__logo {
      height: 13px;
      opacity: 0.6;
    }
  }

  /* empty state */
  .doc-search-empty {
    margin: 0;
    padding: 14px 0;
    text-align: center;
    color: #8d95a3;
    font-size: 13px;
  }
}
</style>

<script>
import searchData from '../search-meta.json';

export default {
  data() {
    return {
      query: '',
      isEmpty: false,
      langs: {
        'zh-CN': {
          search: '搜索文档',
          empty: '无匹配结果'
        },
        'en-US': {
          search: 'Search',
          empty: 'No results'
        },
        es: {
          search: 'Buscar',
          empty: 'No hay datos que coincidan'
        },
        'fr-FR': {
          search: 'Rechercher',
          empty: 'Aucun résultat'
        }
      }
    };
  },

  computed: {
    lang() {
      return this.$route.meta.lang || 'zh-CN';
    },

    placeholder() {
      return this.lang ? this.langs[this.lang].search : '';
    },

    emptyText() {
      return this.lang ? this.langs[this.lang].empty : '';
    }
  },

  methods: {
    querySearch(query, cb) {
      if (!query) return;
      const q = query.toLowerCase();
      let list = searchData[this.lang] || [];

      let results = list
        .filter((item) => {
          return (
            item.title.toLowerCase().indexOf(q) > -1 ||
            item.body.toLowerCase().indexOf(q) > -1 ||
            item.path.toLowerCase().indexOf(q) > -1
          );
        })
        .slice(0, 15);

      if (results.length > 0) {
        this.isEmpty = false;
        cb(
          results.map((hit) => {
            return {
              path: hit.path,
              highlightedCompo: hit.title.split(' > ')[0],
              title: hit.title.includes(' > ')
                ? hit.title.split(' > ')[1]
                : hit.title,
              content: hit.body
            };
          })
        );
      } else {
        this.isEmpty = true;
        cb([{ isEmpty: true }]);
      }
    },

    handleSelect(val) {
      if (val.isEmpty) return;
      if (val.path) {
        this.$router.push(val.path);
      }
    }
  }
};
</script>
