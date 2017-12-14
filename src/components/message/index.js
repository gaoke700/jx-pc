import Vue from 'vue';
import { PopupManager } from 'element-ui/src/utils/popup';

const MessageConstructor = Vue.extend(require('./main.vue'));

let instance;
// 消息实例列表
const instances = [];
let seed = 1;

/* eslint-disable no-param-reassign */
function Message(options) {
  options = options || {};
  // 只传入消息（其它配置为默认），如 this.$message('this is a message')
  if (typeof options === 'string') {
    options = {
      message: options,
    };
  }

  const userOnClose = options.onClose;
  // 保存当前Message实例的索引
  const id = `message_${seed += 1}`;

  // 代理用户自定关闭事件，关闭消息队列中当前消息
  options.onClose = function onClose() {
    Message.close(id, userOnClose);
  };

  // 实例化消息组件
  instance = new MessageConstructor({
    data: options,
  });
  instance.id = id;
  // 手动地挂载一个未挂载的消息组件实例
  instance.vm = instance.$mount();
  // 将消息实例使用的根 DOM 元素插入到 body 中
  document.body.appendChild(instance.vm.$el);
  // 默认显示
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  // 弹层index累加，确保最新的消息在最上方
  instance.dom.style.zIndex = PopupManager.nextZIndex();
  instances.push(instance);
  // 返回挂载的消息实例
  return instance.vm;
}

// 关闭指定的 Message（内部使用方法）
Message.close = function close(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i += 1) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        // 执行自定义关闭事件
        userOnClose(instances[i]);
      }
      // 从列表中移除
      instances.splice(i, 1);
      break;
    }
  }
};

// 关闭所有 Message
Message.closeAll = function closeAll() {
  for (let i = instances.length - 1; i >= 0; i -= 1) {
    instances[i].close();
  }
};

export default Message;
