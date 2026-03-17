<template>
  <div
    class="demo-block"
    :class="[blockClass, { 'hover': hovering }]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <div class="source">
      <slot name="source"></slot>
    </div>
    <div class="meta" ref="meta">
      <div class="description" v-if="$slots.default">
        <slot></slot>
      </div>
      <div class="highlight">
        <slot name="highlight"></slot>
      </div>
    </div>
    <div
      class="demo-block-control"
      ref="control"
      :class="{ 'is-fixed': fixedControl }"
      @click="isExpanded = !isExpanded">
      <transition name="arrow-slide">
        <i :class="[iconClass, { 'hovering': hovering }]"></i>
      </transition>
      <transition name="text-slide">
        <span v-show="hovering">{{ controlText }}</span>
      </transition>
      <el-tooltip effect="dark" :content="langConfig['tooltip-text']" placement="right">
        <transition name="text-slide">
          <el-button
            v-show="hovering || isExpanded"
            size="small"
            type="text"
            class="control-button"
            @click.stop="goCodepen">
            {{ langConfig['button-text'] }}
          </el-button>
        </transition>
      </el-tooltip>
    </div>
  </div>
</template>

<style lang="scss">
  .demo-block {
    border: 1px solid var(--doc-border, #e2e6ef);
    border-radius: 12px;
    margin-bottom: 28px;
    transition: box-shadow .2s;
    overflow: hidden;
    background: #fff;

    &.hover {
      box-shadow: 0 4px 24px rgba(91,106,240,.1), 0 1px 6px rgba(0,0,0,.06);
    }

    code {
      font-family: 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace;
    }

    /* ---- Demo preview area ---- */
    .source {
      padding: 28px 24px;
    }

    /* ---- Expandable code area ---- */
    .meta {
      background: #0d1117;
      border-top: 1px solid rgba(255,255,255,.06);
      overflow: hidden;
      height: 0;
      transition: height .22s ease;
    }

    /* ---- Description box ---- */
    .description {
      padding: 16px 20px;
      background: rgba(255,255,255,.04);
      border-bottom: 1px solid rgba(255,255,255,.06);
      font-size: 13.5px;
      line-height: 1.7;
      color: #94a3b8;
      word-break: break-word;

      p { margin: 0; }

      code {
        color: #818cf8;
        background: rgba(129,140,248,.12);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
    }

    /* ---- Highlight/code block ---- */
    .highlight {
      pre { margin: 0; }

      code.hljs {
        margin: 0;
        border: none;
        max-height: none;
        border-radius: 0;
        padding: 20px 24px;

        &::before { content: none; }
      }
    }

    /* ---- Control bar (toggle code) ---- */
    .demo-block-control {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      background: var(--doc-bg-soft, #f7f8fc);
      border-top: 1px solid var(--doc-border, #e2e6ef);
      border-radius: 0 0 12px 12px;
      cursor: pointer;
      color: #94a3b8;
      font-size: 13px;
      gap: 6px;
      position: relative;
      transition: color .15s, background .15s;
      user-select: none;

      &.is-fixed {
        position: fixed;
        bottom: 0;
        width: 868px;
        border-radius: 0;
        z-index: 9;
      }

      &:hover {
        color: #5b6af0;
        background: #eff1ff;
      }

      i {
        font-size: 14px;
        transition: transform .25s;
      }

      > span {
        font-size: 13px;
        transition: opacity .2s;
      }

      .control-button {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12.5px;
        padding: 3px 10px;
        height: 26px;
        line-height: 20px;
        border-radius: 6px;
        background: rgba(91,106,240,.1);
        color: #5b6af0;
        border: none;
        cursor: pointer;
        transition: background .15s;

        &:hover {
          background: rgba(91,106,240,.2);
        }
      }

      .text-slide-enter,
      .text-slide-leave-active {
        opacity: 0;
        transform: translateX(6px);
      }
    }
  }
</style>

<script type="text/babel">
  import compoLang from '../i18n/component.json';
  import Element from 'main/index.js';
  import { stripScript, stripStyle, stripTemplate } from '../util';
  const { version } = Element;

  export default {
    data() {
      return {
        codepen: {
          script: '',
          html: '',
          style: ''
        },
        hovering: false,
        isExpanded: false,
        fixedControl: false,
        scrollParent: null
      };
    },

    methods: {
      goCodepen() {
        // since 2.6.2 use code rather than jsfiddle https://blog.codepen.io/documentation/api/prefill/
        const { script, html, style } = this.codepen;
        const resourcesTpl = '<scr' + 'ipt src="//unpkg.com/vue@2/dist/vue.js"></scr' + 'ipt>' +
        '\n<scr' + `ipt src="//unpkg.com/element-ui@${ version }/lib/index.js"></scr` + 'ipt>';
        let jsTpl = (script || '').replace(/export default/, 'var Main =').trim();
        let htmlTpl = `${resourcesTpl}\n<div id="app">\n${html.trim()}\n</div>`;
        let cssTpl = `@import url("//unpkg.com/element-ui@${ version }/lib/theme-chalk/index.css");\n${(style || '').trim()}\n`;
        jsTpl = jsTpl
          ? jsTpl + '\nvar Ctor = Vue.extend(Main)\nnew Ctor().$mount(\'#app\')'
          : 'new Vue().$mount(\'#app\')';
        const data = {
          js: jsTpl,
          css: cssTpl,
          html: htmlTpl
        };
        const form = document.getElementById('fiddle-form') || document.createElement('form');
        while (form.firstChild) {
          form.removeChild(form.firstChild);
        }
        form.method = 'POST';
        form.action = 'https://codepen.io/pen/define/';
        form.target = '_blank';
        form.style.display = 'none';

        const input = document.createElement('input');
        input.setAttribute('name', 'data');
        input.setAttribute('type', 'hidden');
        input.setAttribute('value', JSON.stringify(data));

        form.appendChild(input);
        document.body.appendChild(form);

        form.submit();
      },

      scrollHandler() {
        const { top, bottom, left } = this.$refs.meta.getBoundingClientRect();
        this.fixedControl = bottom > document.documentElement.clientHeight &&
          top + 44 <= document.documentElement.clientHeight;
        this.$refs.control.style.left = this.fixedControl ? `${ left }px` : '0';
      },

      removeScrollHandler() {
        this.scrollParent && this.scrollParent.removeEventListener('scroll', this.scrollHandler);
      }
    },

    computed: {
      lang() {
        return this.$route.path.split('/')[1];
      },

      langConfig() {
        return compoLang.filter(config => config.lang === this.lang)[0]['demo-block'];
      },

      blockClass() {
        return `demo-${ this.lang } demo-${ this.$router.currentRoute.path.split('/').pop() }`;
      },

      iconClass() {
        return this.isExpanded ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
      },

      controlText() {
        return this.isExpanded ? this.langConfig['hide-text'] : this.langConfig['show-text'];
      },

      codeArea() {
        return this.$el.getElementsByClassName('meta')[0];
      },

      codeAreaHeight() {
        if (this.$el.getElementsByClassName('description').length > 0) {
          return this.$el.getElementsByClassName('description')[0].clientHeight +
            this.$el.getElementsByClassName('highlight')[0].clientHeight + 20;
        }
        return this.$el.getElementsByClassName('highlight')[0].clientHeight;
      }
    },

    watch: {
      isExpanded(val) {
        this.codeArea.style.height = val ? `${ this.codeAreaHeight + 1 }px` : '0';
        if (!val) {
          this.fixedControl = false;
          this.$refs.control.style.left = '0';
          this.removeScrollHandler();
          return;
        }
        setTimeout(() => {
          this.scrollParent = document.querySelector('.page-component__scroll > .el-scrollbar__wrap');
          this.scrollParent && this.scrollParent.addEventListener('scroll', this.scrollHandler);
          this.scrollHandler();
        }, 200);
      }
    },

    created() {
      const highlight = this.$slots.highlight;
      if (highlight && highlight[0]) {
        let code = '';
        let cur = highlight[0];
        if (cur.tag === 'pre' && (cur.children && cur.children[0])) {
          cur = cur.children[0];
          if (cur.tag === 'code') {
            code = cur.children[0].text;
          }
        }
        if (code) {
          this.codepen.html = stripTemplate(code);
          this.codepen.script = stripScript(code);
          this.codepen.style = stripStyle(code);
        }
      }
    },

    mounted() {
      this.$nextTick(() => {
        let highlight = this.$el.getElementsByClassName('highlight')[0];
        if (this.$el.getElementsByClassName('description').length === 0) {
          highlight.style.width = '100%';
          highlight.borderRight = 'none';
        }
      });
    },

    beforeDestroy() {
      this.removeScrollHandler();
    }
  };
</script>
