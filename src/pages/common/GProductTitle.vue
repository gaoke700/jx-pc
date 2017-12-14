<template>
  <div
    class="g-product-title"
    v-if="title">
    <div class="g-product-title-line"></div>
    <div
      class="g-product-title-text"
      v-text="title">
    </div>
  </div>
</template>

<script>
  export default {
    props: ['title'],
    mounted() {
    },
    data() {
      return {};
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";

  $height: 10px;

  .g-product-title {
    position: relative;
    height: 114px;
    line-height: 114px;
    text-align: center;
    background: white;

    .g-product-title-line {
      position: absolute;
      top: 50%;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      height: $height;
      margin-top: -$height/2;
      border: 1px solid #cccccc;
      border-right: none;
      border-left: none;
    }

    .g-product-title-text {
      position: relative;
      z-index: 2;
      display: inline-block;
      padding: 0 45px;
      font-size: 36px;
      font-weight: bold;
      color: #333333;
      background: inherit;
    }
  }
</style>
