import Vue from 'vue';
import Main from './main.vue';
import { PopupManager } from 'element-ui/src/utils/popup';
import { isVNode } from 'element-ui/src/utils/vdom';
import { isObject } from 'element-ui/src/utils/types';
let MessageConstructor = Vue.extend(Main);

let instance;
let instances = [];
let seed = 1;
// 分组单例存储：key -> { instance, count }
const groups = Object.create(null);

const Message = function(options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  let userOnClose = options.onClose;
  let id = 'message_' + seed++;

  options.onClose = function() {
    Message.close(id, userOnClose);
  };
  instance = new MessageConstructor({
    data: options
  });
  instance.id = id;
  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message];
    instance.message = null;
  }
  instance.$mount();
  document.body.appendChild(instance.$el);
  let verticalOffset = options.offset || 20;
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  instance.verticalOffset = verticalOffset;
  instance.visible = true;
  instance.$el.style.zIndex = PopupManager.nextZIndex();
  instances.push(instance);
  return instance;
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = (options) => {
    if (isObject(options) && !isVNode(options)) {
      return Message({
        ...options,
        type
      });
    }
    return Message({
      type,
      message: options
    });
  };
});

Message.close = function(id, userOnClose) {
  let len = instances.length;
  let index = -1;
  let removedHeight;
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      removedHeight = instances[i].$el.offsetHeight;
      index = i;
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return;
  for (let i = index; i < len - 1 ; i++) {
    let dom = instances[i].$el;
    dom.style['top'] =
      parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px';
  }
};

Message.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

// ============ 分组单例 API ============
// 用法：Message.group(key, options)
// - 相同 key 的多次调用，将复用同一条消息，并将左上角计数 +1
// - options 与 Message 一致；首次创建时应用其属性，之后仅更新 message/type 等展示字段（可按需）
Message.group = function(key, options = {}) {
  if (!key) return Message(options);
  // 复用已存在的分组实例
  const rec = groups[key];
  if (rec && rec.instance && !rec.instance.closed) {
    rec.count += 1;
    // 更新实例展示：计数、内容、类型（若传了）
    const ins = rec.instance;
    ins.count = rec.count;
    if (typeof options.message !== 'undefined') ins.message = options.message;
    if (typeof options.type !== 'undefined') ins.type = options.type;
    if (typeof options.customClass !== 'undefined') ins.customClass = options.customClass;
    // 重置计时并保持在最顶部 z-index
    ins.clearTimer && ins.clearTimer();
    ins.startTimer && ins.startTimer();
    ins.$el && (ins.$el.style.zIndex = PopupManager.nextZIndex());
    return ins;
  }

  // 创建新的分组实例
  const merged = { ...options };
  const userOnClose = merged.onClose;
  merged.onClose = function(inst) {
    // 清理分组记录
    const r = groups[key];
    if (r && r.instance === inst) {
      delete groups[key];
    }
    if (typeof userOnClose === 'function') userOnClose(inst);
  };
  const inst = Message(merged);
  groups[key] = { instance: inst, count: 1 };
  inst.count = 1;
  return inst;
};

// 关闭指定分组
Message.closeGroup = function(key) {
  const rec = groups[key];
  if (rec && rec.instance && !rec.instance.closed) {
    rec.instance.close();
  }
};

export default Message;
