<template>
  <section class="biz-card" :class="[shadowClass, { 'is-bordered': bordered }]">
    <header v-if="hasHeader" class="biz-card__header">
      <div class="biz-card__title-wrap">
        <h3 v-if="title || $slots.title" class="biz-card__title">
          <slot name="title">{{ title }}</slot>
        </h3>
        <p v-if="subtitle || $slots.subtitle" class="biz-card__subtitle">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>
      </div>

      <div v-if="$slots.extra" class="biz-card__extra">
        <slot name="extra"></slot>
      </div>
    </header>

    <div class="biz-card__body">
      <slot></slot>
    </div>

    <footer v-if="$slots.footer" class="biz-card__footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'BizCard',

  props: {
    title: String,
    subtitle: String,
    shadow: {
      type: String,
      default: 'always',
      validator(value) {
        return ['always', 'hover', 'never'].indexOf(value) !== -1;
      }
    },
    bordered: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    shadowClass() {
      return `is-${this.shadow}-shadow`;
    },

    hasHeader() {
      return Boolean(
        this.title ||
        this.subtitle ||
        this.$slots.title ||
        this.$slots.subtitle ||
        this.$slots.extra
      );
    }
  }
};
</script>

<style scoped>
.biz-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid transparent;
  box-shadow: 0 8px 30px rgba(15, 20, 40, .06);
  transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
}

.biz-card.is-bordered {
  border-color: #e8edf5;
}

.biz-card.is-never-shadow {
  box-shadow: none;
}

.biz-card.is-hover-shadow:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 36px rgba(15, 20, 40, .08);
}

.biz-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px 0;
}

.biz-card__title-wrap {
  min-width: 0;
}

.biz-card__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  color: #18191c;
}

.biz-card__subtitle {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: #6b7a99;
}

.biz-card__extra {
  flex-shrink: 0;
}

.biz-card__body {
  padding: 18px 22px 22px;
  color: #4a5260;
  line-height: 1.8;
}

.biz-card__footer {
  margin: 0 22px 20px;
  padding-top: 16px;
  border-top: 1px solid #eef2f7;
}
</style>