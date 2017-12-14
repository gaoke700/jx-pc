<template>
  <li class="ui-dropdown" :class="activeCls" @mouseenter="show" @mouseleave="hide">
    <div class="title" :style="{height: (height + 1) + 'px'}">
      <slot name="title"></slot>
    </div>
    <div class="content" :style="[{top: height + 'px'}, contentAlign]">
      <slot></slot>
    </div>
  </li>
</template>

<script>
  export default {
    props: {
      height: {
        type: Number,
        default: 30,
      },
      align: {
        type: String,
        default: 'left',
      },
    },

    data() {
      return {
        timeout: null,
        visible: false,
      };
    },

    computed: {
      activeCls() {
        return this.visible ? 'hover' : '';
      },
      contentAlign() {
        return this.align === 'right' ? { right: 0 } : {};
      },
    },
    methods: {
      show() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.visible = true;
        }, 250);
      },
      hide() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.visible = false;
        }, 150);
      },
    },
  };
</script>

<style lang="scss">
  @import "../styles/theme";

  .ui-dropdown {
    position: relative;
    z-index: 110;
    box-sizing: border-box;

    @include clearfix();

    &.hover {
      padding: 0;

      .title {
        background-color: white;
        border: 1px solid #e5e5e5;
        border-top: none;
        border-bottom: none;
      }

      .content {
        display: block;
      }
    }

    .title {
      position: relative;
      z-index: 1;
      padding: 0 10px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid transparent;
      border-top: none;
      border-bottom: none;
    }

    .content {
      position: absolute;
      display: none;
      background-color: white;
      border: 1px solid #e5e5e5;
    }
  }
</style>
