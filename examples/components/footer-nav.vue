<template>
  <div class="footer-nav">
    <span
      v-if="leftNav"
      class="footer-nav-link footer-nav-left"
      @click="handleNavClick('prev')">
      <i class="el-icon-arrow-left"></i>
      {{ leftNav.title || leftNav.name }}
    </span>
    <span
      v-if="rightNav"
      class="footer-nav-link footer-nav-right"
      @click="handleNavClick('next')">
      {{ rightNav.title || rightNav.name }}
      <i class="el-icon-arrow-right"></i>
    </span>
  </div>
</template>

<style lang="scss">
  .footer-nav {
    padding: 40px 0;
    color: #333;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 20px;
    
    & i {
      transition: .3s;
      color: #999;
      vertical-align: baseline;
    }
  }
  
  .footer-nav-link {
    cursor: pointer;
    transition: .3s;
    display: flex;
    align-items: center;
    gap: 6px;
    
    &:hover {
      color: #409EFF;
     
      & i {
        color: #409EFF;
      }
    }
  }
  
  .footer-nav-left {
    justify-content: flex-start;
  }
  
  .footer-nav-right {
    justify-content: flex-end;
  }

  /* Dark mode support */
  html[data-theme='dark'] .footer-nav {
    color: #c9d1d9;

    & i {
      color: #8b949e;
    }
  }

  html[data-theme='dark'] .footer-nav-link:hover {
    color: #58a6ff;

    & i {
      color: #58a6ff;
    }
  }
</style>

<script>
  import navConfig from '../nav.config.json';

  export default {
    data() {
      return {
        currentComponent: null,
        nav: [],
        currentIndex: -1,
        leftNav: null,
        rightNav: null
      };
    },

    computed: {
      lang() {
        return this.$route.meta.lang;
      }
    },

    watch: {
      '$route.path'() {
        this.setNav();
        this.updateNav();
      }
    },

    methods: {
      setNav() {
        let nav = navConfig[this.lang];
        this.nav = [nav[0]].concat(nav[3].children);
        nav[4].groups.map(group => group.list).forEach(list => {
          this.nav = this.nav.concat(list);
        });
      },

      updateNav() {
        this.currentComponent = '/' + this.$route.path.split('/')[3];
        for (let i = 0, len = this.nav.length; i < len; i++) {
          if (this.nav[i].path === this.currentComponent) {
            this.currentIndex = i;
            break;
          }
        }
        this.leftNav = this.nav[this.currentIndex - 1];
        this.rightNav = this.nav[this.currentIndex + 1];
      },

      handleNavClick(direction) {
        this.$router.push(`/${ this.lang }/component${ direction === 'prev' ? this.leftNav.path : this.rightNav.path }`);
      }
    },

    created() {
      this.setNav();
      this.updateNav();
    }
  };
</script>