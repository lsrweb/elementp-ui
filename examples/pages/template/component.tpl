<style>
  /* =============================================
     Component page scroll container
     ============================================= */
  .page-component__scroll {
    height: calc(100% - 64px);
    margin-top: 64px;

    > .el-scrollbar__wrap {
      overflow-x: auto;
    }
  }

  /* =============================================
     Page shell
     ============================================= */
  .page-component {
    box-sizing: border-box;
    height: 100%;

    &.page-container {
      padding: 0;
    }

    /* ------ Left sidebar ------ */
    .page-component__nav {
      width: 260px;
      position: fixed;
      top: 0;
      bottom: 0;
      margin-top: 64px;
      background: var(--nav-bg);
      border-right: 1px solid var(--nav-border);
      z-index: 10;
      overflow: hidden;
    }

    /* The doc-sidenav component fills the nav container */
    .doc-sidenav {
      height: 100%;
    }

    /* ------ Main content ------ */
    .page-component__content {
      padding-left: 260px;
      padding-bottom: 80px;
      box-sizing: border-box;
    }

    /* ------ Doc content area ------ */
    .content {
      padding: 48px 56px 0;
      max-width: 960px;

      /* === Section headings === */
      > h2 {
        font-size: 26px;
        font-weight: 700;
        color: #18191c;
        margin: 0 0 10px;
        padding-bottom: 14px;
        border-bottom: 1px solid #edf0f5;
        letter-spacing: -.4px;
      }

      > h3 {
        font-size: 17px;
        font-weight: 600;
        color: #18191c;
        margin: 52px 0 16px;
      }

      > h4 {
        font-size: 15px;
        font-weight: 600;
        color: #2e3440;
        margin: 32px 0 12px;
      }

      /* === API Tables === */
      > table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: #fff;
        font-size: 13.5px;
        margin-bottom: 48px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #e8edf5;
        box-shadow: 0 1px 6px rgba(15,20,40,.05);

        strong {
          font-weight: 500;
        }

        thead tr {
          background: #f5f7fc;
        }

        th {
          padding: 11px 16px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 700;
          color: #6b7a99;
          letter-spacing: .06em;
          text-transform: uppercase;
          white-space: nowrap;
          border-bottom: 1px solid #e8edf5;
        }

        th:first-child { padding-left: 20px; border-radius: 10px 0 0 0; }
        th:last-child  { border-radius: 0 10px 0 0; }

        td {
          padding: 11px 16px;
          color: #4a5260;
          vertical-align: middle;
          line-height: 1.65;
          border-bottom: 1px solid #f2f4f8;

          code {
            background: #eff1ff;
            color: #5b6af0;
            padding: 2px 7px;
            border-radius: 5px;
            font-size: .82em;
            font-family: 'JetBrains Mono', 'Fira Code', Menlo, monospace;
          }
        }

        td:first-child { padding-left: 20px; }

        tr:last-child td { border-bottom: none; }

        /* zebra stripe */
        tbody tr:nth-child(even) td {
          background: #fafbff;
        }

        tbody tr:hover td {
          background: #f0f3ff;
          transition: background .1s;
        }
      }

      /* === Unordered lists === */
      > ul:not(.timeline) {
        margin: 14px 0;
        padding: 0 0 0 22px;
        font-size: 14.5px;
        color: #4a5260;
        line-height: 2;
      }

      /* === Paragraphs === */
      > p {
        font-size: 15px;
        color: #4a5260;
        line-height: 1.8;
        margin: 14px 0;
      }
    }
  }

  /* =============================================
     Mobile
     ============================================= */
  @media (max-width: 768px) {
    .page-component {
      .page-component__nav {
        width: 100%;
        position: static;
        margin-top: 0;
        background: #0d1117;
        border-right: none;
        border-bottom: 1px solid rgba(255,255,255,.07);
        height: auto;
      }

      .doc-sidenav {
        height: auto;
        max-height: 50vh;
      }

      .page-component__content {
        padding-left: 0;
        padding-right: 0;
      }

      .content {
        padding: 28px 16px 0;
      }

      .content > table {
        overflow: auto;
        display: block;
        border-radius: 0;
      }
    }
  }
</style>
<template>
  <el-scrollbar class="page-component__scroll" ref="componentScrollBar">
  <div class="page-container page-component">
    <div class="page-component__nav">
      <side-nav :data="navsData[lang]" :base="`/${ lang }/component`"></side-nav>
    </div>
    <div class="page-component__content">
      <router-view class="content"></router-view>
      <footer-nav></footer-nav>
    </div>
    <el-backtop
      v-if="showBackToTop"
      target=".page-component__scroll .el-scrollbar__wrap"
      :right="100"
      :bottom="150"
    ></el-backtop>
  </div>
  </el-scrollbar>
</template>
<script>
  import bus from '../../bus';
  import navsData from '../../nav.config.json';
  import throttle from 'throttle-debounce/throttle';

  export default {
    data() {
      return {
        lang: this.$route.meta.lang,
        navsData,
        scrollTop: 0,
        showHeader: true,
        componentScrollBar: null,
        componentScrollBoxElement: null
      };
    },
    watch: {
      '$route.path'() {
        // 触发伪滚动条更新
        this.componentScrollBox.scrollTop = 0;
        this.$nextTick(() => {
          this.componentScrollBar.update();
        });
      }
    },
    methods: {
      renderAnchorHref() {
        if (/changelog/g.test(location.href)) return;
        const anchors = document.querySelectorAll('h2 a,h3 a,h4 a,h5 a');
        const basePath = location.href.split('#').splice(0, 2).join('#');

        [].slice.call(anchors).forEach(a => {
          const href = a.getAttribute('href');
          a.href = basePath + href;
        });
      },

      goAnchor() {
        if (location.href.match(/#/g).length > 1) {
          const anchor = location.href.match(/#[^#]+$/g);
          if (!anchor) return;
          const elm = document.querySelector(anchor[0]);
          if (!elm) return;

          setTimeout(_ => {
            this.componentScrollBox.scrollTop = elm.offsetTop;
          }, 50);
        }
      },

      handleScroll() {
        const scrollTop = this.componentScrollBox.scrollTop;
        if (this.showHeader !== this.scrollTop > scrollTop) {
          this.showHeader = this.scrollTop > scrollTop;
        }
        if (scrollTop === 0) {
          this.showHeader = true;
        }
        if (!this.navFaded) {
          bus.$emit('fadeNav');
        }
        this.scrollTop = scrollTop;
      }
    },
    computed: {
      showBackToTop() {
        return !this.$route.path.match(/backtop/);
      }
    },
    created() {
      bus.$on('navFade', val => {
        this.navFaded = val;
      });
    },
    mounted() {
      this.componentScrollBar = this.$refs.componentScrollBar;
      this.componentScrollBox = this.componentScrollBar.$el.querySelector('.el-scrollbar__wrap');
      this.throttledScrollHandler = throttle(300, this.handleScroll);
      this.componentScrollBox.addEventListener('scroll', this.throttledScrollHandler);
      this.renderAnchorHref();
      this.goAnchor();
      document.body.classList.add('is-component');
    },
    destroyed() {
      document.body.classList.remove('is-component');
    },
    beforeDestroy() {
      this.componentScrollBox.removeEventListener('scroll', this.throttledScrollHandler);
    },
    beforeRouteUpdate(to, from, next) {
      next();
      setTimeout(() => {
        const toPath = to.path;
        const fromPath = from.path;
        if (toPath === fromPath && to.hash) {
          this.goAnchor();
        }
        if (toPath !== fromPath) {
          document.documentElement.scrollTop = document.body.scrollTop = 0;
          this.renderAnchorHref();
        }
      }, 100);
    }
  };
</script>
