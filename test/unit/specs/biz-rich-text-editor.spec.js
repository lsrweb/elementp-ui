import { createTest, destroyVM, waitImmediate } from '../util';
import BizRichTextEditor from 'business/biz-rich-text-editor';

describe('BizRichTextEditor', () => {
  let vm;
  const originalQuill = window.Quill;

  class MockQuill {
    constructor(el, options) {
      this.el = el;
      this.options = options;
      this.handlers = {};
      this.enabled = true;
      this.root = document.createElement('div');
      this.root.className = 'ql-editor';
      this.root.innerHTML = '<p><br></p>';
      this.el.innerHTML = '';
      this.el.appendChild(this.root);
      this.clipboard = {
        dangerouslyPasteHTML: html => {
          this.root.innerHTML = html || '<p><br></p>';
        }
      };
    }

    on(name, handler) {
      this.handlers[name] = handler;
    }

    off(name, handler) {
      if (this.handlers[name] === handler) {
        delete this.handlers[name];
      }
    }

    enable(flag) {
      this.enabled = flag;
    }

    getLength() {
      return this.root.innerHTML === '<p><br></p>' ? 1 : this.root.textContent.length + 1;
    }

    setText(text) {
      this.root.innerHTML = text ? `<p>${text}</p>` : '<p><br></p>';
    }

    focus() {}

    blur() {}
  }

  beforeEach(() => {
    window.Quill = MockQuill;
  });

  afterEach(() => {
    destroyVM(vm);
    window.Quill = originalQuill;
  });

  it('create and sync value', async() => {
    vm = createTest(BizRichTextEditor, {
      propsData: {
        value: '<p>Hello Biz</p>',
        placeholder: 'Write here'
      }
    }, true);

    await waitImmediate();

    expect(vm.quill).to.exist;
    expect(vm.quill.options.placeholder).to.equal('Write here');
    expect(vm.quill.options.theme).to.equal('snow');
    expect(vm.quill.root.innerHTML).to.equal('<p>Hello Biz</p>');
  });

  it('emits input when user edits', async() => {
    vm = createTest(BizRichTextEditor, {
      propsData: {
        value: ''
      }
    }, true);

    const spy = sinon.spy();
    vm.$on('input', spy);

    vm.quill.root.innerHTML = '<p>Edited content</p>';
    vm.quill.handlers['text-change']({}, {}, 'user');

    await waitImmediate();

    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0]).to.equal('<p>Edited content</p>');
  });

  it('toggles disabled state', async() => {
    vm = createTest(BizRichTextEditor, {
      propsData: {
        disabled: true
      }
    }, true);

    await waitImmediate();

    expect(vm.quill.enabled).to.be.false;

    vm.disabled = false;
    await waitImmediate();

    expect(vm.quill.enabled).to.be.true;
  });
});