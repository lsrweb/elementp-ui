<template>
  <div
    ref="editor"
    class="biz-rich-text-editor"
    :class="{
      'is-disabled': disabled || readOnly,
      'has-toolbar': hasToolbar,
      'is-toolbar-hidden': !hasToolbar
    }"
    :style="editorStyle"
  ></div>
</template>

<script>

const DEFAULT_TOOLBAR = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['link', 'image', 'blockquote', 'code-block'],
  ['clean']
];

function resolveQuill() {
  if (typeof window !== 'undefined' && window.Quill) {
    return window.Quill;
  }

  throw new Error('BizRichTextEditor requires Quill to be loaded on window.Quill first.');
}

export default {
  name: 'BizRichTextEditor',

  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    height: {
      type: [String, Number],
      default: '320px'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: [Boolean, Array, Object, String],
      default() {
        return DEFAULT_TOOLBAR;
      }
    },
    theme: {
      type: String,
      default: 'snow'
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      quill: null
    };
  },

  computed: {
    hasToolbar() {
      return this.toolbar !== false && this.toolbar !== null;
    },

    editorStyle() {
      return {
        '--biz-rich-text-editor-height': this.normalizeHeight(this.height)
      };
    }
  },

  watch: {
    value(val) {
      this.setContent(val);
    },

    disabled() {
      this.setDisabledState();
    },

    readOnly() {
      this.setDisabledState();
    },

    toolbar: {
      deep: true,
      handler() {
        this.rebuildEditor();
      }
    },

    options: {
      deep: true,
      handler() {
        this.rebuildEditor();
      }
    }
  },

  mounted() {
    this.initEditor();
  },

  beforeDestroy() {
    this.destroyEditor();
  },

  methods: {
    normalizeHeight(value) {
      if (typeof value === 'number' || /^\d+$/.test(String(value))) {
        return `${value}px`;
      }

      return value;
    },

    initEditor() {
      if (!this.$refs.editor) return;

      const Quill = resolveQuill();
      const config = Object.assign({}, this.options, {
        placeholder: this.placeholder,
        readOnly: this.disabled || this.readOnly || this.options.readOnly,
        theme: this.theme || this.options.theme || 'snow',
        modules: Object.assign({}, this.options.modules || {})
      });

      if (this.toolbar !== undefined) {
        config.modules.toolbar = this.toolbar;
      }

      this.quill = new Quill(this.$refs.editor, config);
      this.quill.on('text-change', this.handleTextChange);
      this.quill.on('selection-change', this.handleSelectionChange);
      this.setContent(this.value);
      this.setDisabledState();
    },

    rebuildEditor() {
      this.destroyEditor();
      this.$nextTick(() => {
        this.initEditor();
      });
    },

    destroyEditor() {
      if (!this.quill) return;

      this.quill.off('text-change', this.handleTextChange);
      this.quill.off('selection-change', this.handleSelectionChange);
      if (this.$refs.editor) {
        this.$refs.editor.innerHTML = '';
      }
      this.quill = null;
    },

    setDisabledState() {
      if (!this.quill) return;

      this.quill.enable(!(this.disabled || this.readOnly));
    },

    getHtml() {
      if (!this.quill) {
        return this.value || '';
      }

      return this.quill.getLength() <= 1 ? '' : this.quill.root.innerHTML;
    },

    setContent(value) {
      if (!this.quill) return;

      const html = value || '';
      if (html === this.getHtml()) return;

      if (!html) {
        this.quill.setText('');
      } else {
        this.quill.clipboard.dangerouslyPasteHTML(html);
      }
    },

    focus() {
      if (this.quill) {
        this.quill.focus();
      }
    },

    blur() {
      if (this.quill) {
        this.quill.blur();
      }
    },

    handleTextChange(delta, oldDelta, source) {
      if (source !== 'user') return;

      const html = this.getHtml();
      this.$emit('input', html);
      this.$emit('change', html, delta, oldDelta, source);
    },

    handleSelectionChange(range, oldRange, source) {
      if (range) {
        this.$emit('focus', range, oldRange, source);
      } else if (oldRange) {
        this.$emit('blur', oldRange, source);
      }
    }
  }
};
</script>

<style>
.biz-rich-text-editor {
  overflow: hidden;
  border: 1px solid #e8edf5;
  background: #fff;
  box-shadow: 0 8px 30px rgba(15, 20, 40, .05);
}

.biz-rich-text-editor.is-disabled {
  opacity: .82;
}

.biz-rich-text-editor .ql-toolbar.ql-snow {
  border: 0;
  border-bottom: 1px solid #e8edf5;
  background: #f8faff;
}

.biz-rich-text-editor .ql-container.ql-snow {
  border: 0;
}

.biz-rich-text-editor.has-toolbar .ql-container.ql-snow {
  border-radius: 0;
}

.biz-rich-text-editor.is-toolbar-hidden .ql-container.ql-snow {
  border-radius: 0;
}

.biz-rich-text-editor .ql-editor {
  min-height: var(--biz-rich-text-editor-height, 320px);
  padding: 16px 18px 20px;
  line-height: 1.8;
  color: #303133;
}

.biz-rich-text-editor .ql-editor.ql-blank::before {
  left: 18px;
  right: 18px;
  color: #b2b8c2;
  font-style: normal;
}
</style>