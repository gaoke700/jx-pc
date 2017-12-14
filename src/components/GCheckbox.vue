<template>
  <label
    :class="{
      'g-checkbox-checked':isChecked
    }"
    class="g-checkbox">
    <span class="g-checkbox-wrap">
      <span class="iconfont icon-checkbox g-checkbox-mark"></span>
      <input
        :checked="isChecked"
        @change="change()"
        type="checkbox"
        style="display: none;">
    </span>
    <span v-if="$slots.default" class="g-checkbox-text">
      <slot></slot>
    </span>
  </label>
</template>

<script>
  export default {
    data() {
      return {};
    },
    props: {
      isChecked: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      change() {
        this.$emit('change');
      },
    },
  };
</script>

<style lang="scss">
  @import "../styles/theme";

  $height: 14px;

  .g-checkbox {
    border-radius: 2px;
    overflow: hidden;
    display: block;
    height: $height;
    vertical-align: top;
    user-select: none;

    @include clearfix;

    .g-checkbox-wrap {
      box-sizing: border-box;
      float: left;
      width: $height;
      height: inherit;
      line-height: 10px;
      text-align: center;
      background: #ffffff;
      border: 1px solid #999999;

      .g-checkbox-mark {
        display: none;
        font-size: 12px;
      }
    }

    .g-checkbox-text {
      display: inline-block;
      float: left;
      margin-left: 6px;
      line-height: 1;
    }

    &.g-checkbox-checked {
      .g-checkbox-wrap {
        color: #ffffff;
        background: $g-highlight;
        border-color: $g-highlight;

        .g-checkbox-mark {
          display: inline;
        }
      }
    }
  }
</style>
