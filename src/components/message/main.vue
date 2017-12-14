<template>
  <transition name="ui-message-fade">
    <div
      class="ui-message"
      :class="customClass"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer">
      <slot><div>{{ message }}</div></slot>
      <i v-if="showClose" class="iconfont icon-failure ui-message__closeBtn" @click="close"></i>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        message: '',
        duration: 2000,
        customClass: '',
        onClose: null,
        showClose: false,
        closed: false,
        timer: null,
      };
    },

    watch: {
      // 监听当closed被设置为true时，为当前消息绑定transitionend，以在动画结束时移除当前消息
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      },
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        // 完全销毁当前消息实例（清理它与其它实例的连接，解绑它的全部指令及事件监听器）
        this.$destroy();
        // 将它从页面移除
        this.$el.parentNode.removeChild(this.$el);
      },

      // 关闭当前消息
      close() {
        this.closed = true;
        // 执行自定义事件，传入当前实例作为回调参数
        if (typeof this.onClose === 'function') {
          this.onClose(this);
        }
      },

      // 鼠标移入消息提示框，清空计时器，以避免提示框被关闭
      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.duration);
        }
      },
    },

    mounted() {
      this.startTimer();
    },
  };
</script>

<style lang="scss">
  .ui-message {
    box-sizing: border-box;
    position: fixed;
    left: 50%;
    top: 50%;
    min-width: 100px;
    max-width: 500px;
    padding: 20px;
    z-index: 555;
    border-radius: 4px;
    transform: translateX(-50%) translateY(-50%);
    color: white;
    text-align: center;
    background: rgba(0, 0, 0, 0.8);
    transition: opacity 0.3s, transform 0.4s;
  }

  .ui-message__closeBtn {
    position: absolute;
    top: 3px;
    right: 3px;
    cursor: pointer;
    color: #bfcbd9;
    font-size: 14px;

    &:hover {
      color: #97a8be;
    }
  }

  .ui-message-fade-enter,
  .ui-message-fade-leave-active {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
</style>
