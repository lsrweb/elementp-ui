<template>
  <div class="biz-display" :class="[`is-${layout}`, { 'is-muted': muted }]">
    <div v-if="label || $slots.label" class="biz-display__label">
      <slot name="label">{{ label }}</slot>
    </div>

    <div class="biz-display__value">
      <slot>{{ value }}</slot>
    </div>

    <div v-if="note || $slots.note" class="biz-display__note">
      <slot name="note">{{ note }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BizDisplay',

  props: {
    label: String,
    value: [String, Number],
    note: String,
    layout: {
      type: String,
      default: 'stack',
      validator(value) {
        return ['stack', 'inline'].indexOf(value) !== -1;
      }
    },
    muted: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.biz-display {
  padding: 18px 20px;
  border-radius: 12px;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  border: 1px solid #e9edf5;
}

.biz-display.is-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.biz-display.is-muted {
  background: #fafbff;
}

.biz-display__label {
  font-size: 12px;
  line-height: 1.6;
  color: #8d95a3;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.biz-display__value {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
  color: #18191c;
}

.biz-display.is-inline .biz-display__value {
  margin-top: 0;
}

.biz-display__note {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.6;
  color: #6b7a99;
}
</style>