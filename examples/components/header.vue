<style lang="scss" scoped>
  $primary:    #5b6af0;
  $primary-bg: #eff1ff;
  $text:       #18191c;
  $text-2:     #4a5260;
  $text-3:     #8d95a3;
  $border:     rgba(0,0,0,.08);
  $h:          64px;

  .v3-banner {
    background: linear-gradient(90deg, #5b6af0 0%, #818cf8 100%);
    padding: 9px 24px;
    text-align: center;
    font-size: 13.5px;
    color: rgba(255,255,255,.92);
    letter-spacing: .01em;

    a {
      color: #fff;
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 3px;
      margin: 0 4px;
      transition: opacity .15s;
      &:hover { opacity: .8; }
    }
  }

  .headerWrapper {
    height: $h;
  }

  .header {
    height: $h;
    background: rgba(255,255,255,.96);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid $border;
    position: relative;
    width: 100%;
    z-index: 100;

    .container {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 28px;
      box-sizing: border-box;
      gap: 4px;
    }

    h1 {
      margin: 0;
      flex-shrink: 0;
      margin-right: 12px;

      a {
        display: flex;
        align-items: center;
        color: $text;
        text-decoration: none;
      }
    }

    .nav-logo {
      height: 30px;
    }

    .nav-logo-small {
      display: none;
      height: 28px;
    }

    .nav {
      display: flex;
      align-items: center;
      margin: 0 0 0 auto;
      padding: 0;
      list-style: none;
      gap: 2px;
    }

    .nav-gap {
      width: 1px;
      height: 18px;
      background: darken(#e2e6ef, 5%);
      margin: 0 8px;
      flex-shrink: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;

      &.nav-algolia-search {
        cursor: default;
        margin-right: 2px;
      }

      a {
        display: flex;
        align-items: center;
        height: 35px;
        padding: 0 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: $text-2;
        text-decoration: none;
        transition: background .15s, color .15s;
        white-space: nowrap;

        &:hover {
          background: $primary-bg;
          color: $primary;
        }

        &.active {
          background: $primary-bg;
          color: $primary;
          font-weight: 600;

          &::after { display: none; }
        }
      }
    }

    .nav-dropdown {
      margin: 0;
      padding: 0;

      span {
        display: flex;
        align-items: center;
        gap: 5px;
        height: 35px;
        padding: 0 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: $text-2;
        cursor: pointer;
        transition: background .15s, color .15s;
        user-select: none;
        white-space: nowrap;

        &:hover {
          background: $primary-bg;
          color: $primary;
        }
      }

      i {
        font-size: 11px;
        transition: transform .2s;
        color: $text-3;
      }

      &.is-active {
        span {
          background: $primary-bg;
          color: $primary;
        }
        i {
          transform: rotateZ(180deg);
          color: $primary;
        }
      }

      &:hover i { color: $primary; }
    }

    .nav-lang-spe {
      color: $text-3;
      padding: 0 3px;
    }
  }

  .nav-dropdown-list {
    width: auto;
    min-width: 130px;
  }

  @media (max-width: 920px) {
    .header {
      .nav-logo { display: none; }
      .nav-logo-small { display: inline-block; }
      .nav-theme-switch { display: none; }
      .nav-item a { padding: 0 8px; font-size: 13px; }
      .nav-dropdown span { padding: 0 8px; font-size: 13px; }
    }
  }

  @media (max-width: 700px) {
    .header {
      .container { padding: 0 12px; }
      .nav-versions { display: none; }
      .nav-gap { margin: 0 4px; }
      .nav-algolia-search { display: none; }
    }
  }
</style>
<template>
  <div class="headerWrapper">
    <header class="header" ref="header">
      <div class="container">
        <h1><router-link :to="`/${ lang }`">
          <img
            src="../assets/images/element-logo.svg"
            alt="element-logo"
            class="nav-logo">
          <img
            src="../assets/images/element-logo-small.svg"
            alt="element-logo"
            class="nav-logo-small">
        </router-link></h1>

        <ul class="nav">
          <!-- 搜索框：始终显示 -->
          <li class="nav-item nav-algolia-search">
            <algolia-search></algolia-search>
          </li>

          <li class="nav-item">
            <router-link
              active-class="active"
              :to="`/${ lang }/guide`">{{ langConfig.guide }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              active-class="active"
              :to="`/${ lang }/component`">{{ langConfig.components }}
            </router-link>
          </li>
          <li class="nav-item nav-item-theme">
            <router-link
              active-class="active"
              :to="`/${ lang }/theme`">{{ langConfig.theme }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              active-class="active"
              :to="`/${ lang }/resource`"
              exact>{{ langConfig.resource }}
            </router-link>
          </li>

          <!-- 分隔线 -->
          <li class="nav-item">
            <div class="nav-gap"></div>
          </li>

          <!-- 主题模式切换 -->
          <li class="nav-item nav-theme-switch" style="display: flex; align-items: center; margin: 0 10px;">
            <el-switch
              v-model="isDarkMode"
              @change="toggleDarkMode"
              active-text="Dark"
              inactive-text="Light">
            </el-switch>
          </li>

          <!-- 版本选择器 -->
          <li class="nav-item nav-versions">
            <el-dropdown
              trigger="click"
              class="nav-dropdown"
              :class="{ 'is-active': verDropdownVisible }">
              <span>
                {{ version }}
                <i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu
                slot="dropdown"
                class="nav-dropdown-list"
                @input="handleVerDropdownToggle">
                <el-dropdown-item
                  v-for="item in Object.keys(versions)"
                  :key="item"
                  @click.native="switchVersion(item)">
                  {{ item }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>

          <!-- 语言选择器 -->
          <li class="nav-item lang-item">
            <el-dropdown
              trigger="click"
              class="nav-dropdown nav-lang"
              :class="{ 'is-active': langDropdownVisible }">
              <span>
                {{ displayedLang }}
                <i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu
                slot="dropdown"
                class="nav-dropdown-list"
                @input="handleLangDropdownToggle">
                <el-dropdown-item
                  v-for="(value, key) in langs"
                  :key="key"
                  @click.native="switchLang(key)">
                  {{ value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </header>
  </div>
</template>
<script>
  import ThemePicker from './theme-picker.vue';
  import AlgoliaSearch from './search.vue';
  import compoLang from '../i18n/component.json';
  import Element from 'main/index.js';
  import themeLoader from './theme/loader';
  import bus from '../bus';
  import { ACTION_USER_CONFIG_UPDATE } from './theme/constant.js';

  const { version } = Element;

  export default {
    data() {
      return {
        active: '',
        versions: [],
        version,
        isDarkMode: false,
        verDropdownVisible: true,
        langDropdownVisible: true,
        langs: {
          'zh-CN': '中文',
          'en-US': 'English',
          'es': 'Español',
          'fr-FR': 'Français'
        }
      };
    },

    mixins: [themeLoader],

    components: {
      ThemePicker,
      AlgoliaSearch
    },

    computed: {
      lang() {
        return this.$route.path.split('/')[1] || 'zh-CN';
      },
      displayedLang() {
        return this.langs[this.lang] || '中文';
      },
      langConfig() {
        return compoLang.filter(config => config.lang === this.lang)[0]['header'];
      },
      isComponentPage() {
        return /^component/.test(this.$route.name);
      },
      isHome() {
        return /^home/.test(this.$route.name);
      }
    },
    mounted() {
      const testInnerImg = new Image();
      testInnerImg.onload = () => {
        this.$isEle = true;
        ga('send', 'event', 'DocView', 'Ali', 'Inner');
      };
      testInnerImg.onerror = (err) => {
        ga('send', 'event', 'DocView', 'Ali', 'Outer');
        console.error(err);
      };

      // 初始化主题
      const savedTheme = localStorage.getItem('ELEMENT_DOC_THEME');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        this.toggleDarkMode(true);
      }
    },
    methods: {
      toggleDarkMode(val) {
        if (val) {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('ELEMENT_DOC_THEME', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('ELEMENT_DOC_THEME', 'light');
        }
      },
      switchVersion(version) {
        if (version === this.version) return;
        location.href = `${ location.origin }/${ this.versions[version] }/${ location.hash } `;
      },

      switchLang(targetLang) {
        if (this.lang === targetLang) return;
        localStorage.setItem('ELEMENT_LANGUAGE', targetLang);
        this.$router.push(this.$route.path.replace(this.lang, targetLang));
      },

      handleVerDropdownToggle(visible) {
        this.verDropdownVisible = visible;
      },

      handleLangDropdownToggle(visible) {
        this.langDropdownVisible = visible;
      }
    },

    created() {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = _ => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const versions = JSON.parse(xhr.responseText);
          this.versions = Object.keys(versions).reduce((prev, next) => {
            prev[next] = versions[next];
            return prev;
          }, {});
        }
      };
      xhr.open('GET', '/versions.json');
      xhr.send();
      let primaryLast = '#409EFF';
      bus.$on(ACTION_USER_CONFIG_UPDATE, (val) => {
        let primaryColor = val.global['$--color-primary'];
        if (!primaryColor) primaryColor = '#409EFF';
        const base64svg = 'data:image/svg+xml;base64,';
        const imgSet = document.querySelectorAll('h1 img');
        imgSet.forEach((img) => {
          img.src = `${base64svg}${window.btoa(window.atob(img.src.replace(base64svg, '')).replace(primaryLast, primaryColor))}`;
        });
        primaryLast = primaryColor;
      });
    }
  };
</script>
