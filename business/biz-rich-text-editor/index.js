import BizRichTextEditor from './src/main';

/* istanbul ignore next */
BizRichTextEditor.install = function(Vue) {
  Vue.component(BizRichTextEditor.name, BizRichTextEditor);
};

export default BizRichTextEditor;
