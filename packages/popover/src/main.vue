<template>
  <span>
    <transition
      :name="transition"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave">
      <div
        class="el-popover el-popper"
        :class="[popperClass, content && 'el-popover--plain']"
        ref="popper"
        v-show="!disabled && showPopper"
        :style="{ width: width + 'px' }"
        role="tooltip"
        :id="tooltipId"
        :aria-hidden="(disabled || !showPopper) ? 'true' : 'false'"
      >
        <div class="el-popover__title" v-if="title" v-text="title"></div>
        <slot>{{ content }}</slot>
      </div>
    </transition>
    <span class="el-popover__reference-wrapper" ref="wrapper" >
      <slot name="reference"></slot>
    </span>
  </span>
</template>
<script>
import Popper from 'element-ui/src/utils/vue-popper';
import { on, off } from 'element-ui/src/utils/dom';
import { addClass, removeClass } from 'element-ui/src/utils/dom';
import { generateId } from 'element-ui/src/utils/util';

export default {
  name: 'ElPopover',

  mixins: [Popper],

  props: {
    trigger: {
      type: String,
      default: 'click',
      validator: value => ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
    },
    openDelay: {
      type: Number,
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 200
    },
    title: String,
    disabled: Boolean,
    content: String,
    reference: {},
    popperClass: String,
    width: {},
    visibleArrow: {
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },

  computed: {
    tooltipId() {
      return `el-popover-${generateId()}`;
    }
  },
  watch: {
    showPopper(val) {
      if (this.disabled) {
        return;
      }
      val ? this.$emit('show') : this.$emit('hide');
    }
  },

  mounted() {
    let reference = this.referenceElm = this.reference || this.$refs.reference;
    const popper = this.popper || this.$refs.popper;

    if (!reference && this.$refs.wrapper.children) {
      reference = this.referenceElm = this.$refs.wrapper.children[0];
    }
    // 可访问性
    if (popper && popper.setAttribute) {
      popper.setAttribute('tabindex', 0);
    }
    if (reference) {
      addClass(reference, 'el-popover__reference');
      reference.setAttribute('aria-describedby', this.tooltipId);
      reference.setAttribute('tabindex', this.tabindex); // tab序列

      if (this.trigger !== 'click') {
        on(reference, 'focusin', () => {
          this.handleFocus();
          const instance = reference.__vue__;
          if (instance && typeof instance.focus === 'function') {
            instance.focus();
          }
        });
        on(popper, 'focusin', this.handleFocus);
        on(reference, 'focusout', this.handleBlur);
        on(popper, 'focusout', this.handleBlur);
      }
      on(reference, 'keydown', this.handleKeydown);
      on(reference, 'click', this.handleClick);
    }
    // 事件绑定需要在存在 reference 的情况下再进行；单例模式下不会自动绑定
    if (reference) {
      if (this.trigger === 'click') {
        on(reference, 'click', this.doToggle);
        on(document, 'click', this.handleDocumentClick);
      } else if (this.trigger === 'hover') {
        on(reference, 'mouseenter', this.handleMouseEnter);
        on(popper, 'mouseenter', this.handleMouseEnter);
        on(reference, 'mouseleave', this.handleMouseLeave);
        on(popper, 'mouseleave', this.handleMouseLeave);
      } else if (this.trigger === 'focus') {
        if (this.tabindex < 0) {
          console.warn('[Element Warn][Popover]a negative taindex means that the element cannot be focused by tab key');
        }
        if (reference.querySelector && reference.querySelector('input, textarea')) {
          on(reference, 'focusin', this.doShow);
          on(reference, 'focusout', this.doClose);
        } else {
          on(reference, 'mousedown', this.doShow);
          on(reference, 'mouseup', this.doClose);
        }
      }
    } else {
      // 单例模式下，为 click 触发场景仍然监听文档点击以支持外部点击关闭
      if (this.trigger === 'click') {
        on(document, 'click', this.handleDocumentClick);
      }
    }
  },

  beforeDestroy() {
    this.cleanup();
  },

  deactivated() {
    this.cleanup();
  },

  methods: {
    // ========== 单例/编程式 API ==========
    // 显示 popover；可传入 reference 与临时覆盖的展示参数
    open(payload = {}) {
      const { reference, content, title, placement, width, popperClass } = payload;
      // 如果再次点击同一个触发元素且当前已显示，则直接关闭并返回（性能优化）
      if (reference && this.showPopper && this.referenceElm === reference) {
        this.doClose();
        return;
      }
      if (reference) {
        this.setReference(reference);
      }
      if (typeof content !== 'undefined') this.content = content;
      if (typeof title !== 'undefined') this.title = title;
      if (typeof placement !== 'undefined') this.currentPlacement = placement;
      if (typeof width !== 'undefined') this.width = width;
      if (typeof popperClass !== 'undefined') this.popperClass = popperClass;
      // 为了切换 reference/placement，强制重建 popper 实例
      this.doDestroy(true);
      this.doShow();
      this.$nextTick(() => this.updatePopper());
    },
    // 关闭 popover
    close() {
      this.doClose();
    },
    // 切换 popover；若未打开则按 open 逻辑处理
    toggle(payload = {}) {
      const hasMeaningfulPayload = payload && (
        payload.reference ||
        Object.prototype.hasOwnProperty.call(payload, 'content') ||
        Object.prototype.hasOwnProperty.call(payload, 'title') ||
        Object.prototype.hasOwnProperty.call(payload, 'placement') ||
        Object.prototype.hasOwnProperty.call(payload, 'width') ||
        Object.prototype.hasOwnProperty.call(payload, 'popperClass')
      );
      if (hasMeaningfulPayload) {
        // 同一触发元素再次点击 => 关闭
        if (this.showPopper && payload.reference && this.referenceElm === payload.reference) {
          this.close();
          return;
        }
        // 无论当前是否显示，都按打开/切换处理，实现无缝切换
        this.open(payload);
        return;
      }
      // 兼容旧用法：无 payload 时执行开关
      if (this.showPopper) {
        this.close();
      } else {
        this.open();
      }
    },
    // 设置或更新定位参考元素
    setReference(el) {
      if (!el) return;
      // 清理旧的 reference 属性
      const prev = this.referenceElm;
      if (prev && prev !== el) {
        try {
          removeClass(prev, 'el-popover__reference');
          prev.removeAttribute && prev.removeAttribute('aria-describedby');
        } catch (e) {}
      }
      this.referenceElm = el;
      try {
        addClass(el, 'el-popover__reference');
        el.setAttribute('aria-describedby', this.tooltipId);
        el.setAttribute('tabindex', this.tabindex);
      } catch (e) {}
    },
    // ========== 原有事件处理 ==========
    doToggle() {
      this.showPopper = !this.showPopper;
    },
    doShow() {
      this.showPopper = true;
    },
    doClose() {
      this.showPopper = false;
    },
    handleFocus() {
      addClass(this.referenceElm, 'focusing');
      if (this.trigger === 'click' || this.trigger === 'focus') this.showPopper = true;
    },
    handleClick() {
      removeClass(this.referenceElm, 'focusing');
    },
    handleBlur() {
      removeClass(this.referenceElm, 'focusing');
      if (this.trigger === 'click' || this.trigger === 'focus') this.showPopper = false;
    },
    handleMouseEnter() {
      clearTimeout(this._timer);
      if (this.openDelay) {
        this._timer = setTimeout(() => {
          this.showPopper = true;
        }, this.openDelay);
      } else {
        this.showPopper = true;
      }
    },
    handleKeydown(ev) {
      if (ev.keyCode === 27 && this.trigger !== 'manual') { // esc
        this.doClose();
      }
    },
    handleMouseLeave() {
      clearTimeout(this._timer);
      if (this.closeDelay) {
        this._timer = setTimeout(() => {
          this.showPopper = false;
        }, this.closeDelay);
      } else {
        this.showPopper = false;
      }
    },
    handleDocumentClick(e) {
      // 优先使用动态设置的 referenceElm；兼容原有逻辑
      let reference = this.referenceElm || this.reference || this.$refs.reference;
      const popper = this.popper || this.$refs.popper;

      if (!reference && this.$refs.wrapper && this.$refs.wrapper.children) {
        reference = this.referenceElm = this.$refs.wrapper.children[0];
      }
      if (!this.$el ||
        this.$el.contains(e.target) ||
        (reference && reference.contains && reference.contains(e.target)) ||
        !popper ||
        popper.contains(e.target)) return;
      this.showPopper = false;
    },
    handleAfterEnter() {
      this.$emit('after-enter');
    },
    handleAfterLeave() {
      this.$emit('after-leave');
      this.doDestroy();
    },
    cleanup() {
      if (this.openDelay || this.closeDelay) {
        clearTimeout(this._timer);
      }
    }
  },

  destroyed() {
    const reference = this.referenceElm || this.reference;
    if (reference) {
      off(reference, 'click', this.doToggle);
      off(reference, 'mouseup', this.doClose);
      off(reference, 'mousedown', this.doShow);
      off(reference, 'focusin', this.doShow);
      off(reference, 'focusout', this.doClose);
      off(reference, 'mousedown', this.doShow);
      off(reference, 'mouseup', this.doClose);
      off(reference, 'mouseleave', this.handleMouseLeave);
      off(reference, 'mouseenter', this.handleMouseEnter);
      off(reference, 'keydown', this.handleKeydown);
      off(reference, 'click', this.handleClick);
    }
    off(document, 'click', this.handleDocumentClick);
  }
};
</script>
