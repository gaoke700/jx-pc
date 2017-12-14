<template>
  <div class="toolbar">
    <div class="content">
      <a class="a-wrap" href="cart.html">
        <div class="one-block border-b">
          <span class="iconfont icon-cart-thin"></span>
          <span class="red-point">{{countCart}}</span>
        </div>
      </a>
      <a class="a-wrap">
        <div class="one-block border-b">
          <span class="iconfont icon-message"></span>
          <span class="red-point">12</span>
        </div>
      </a>
      <a class="a-wrap">
        <div class="one-block border-b">
          <span class="iconfont icon-servicer"></span>
        </div>
      </a>
      <a class="a-wrap">
        <div class="one-block">
          <span class="iconfont icon-mine"></span>
        </div>
      </a>

    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {};
    },
    computed: {
      countCart() {
        return this.$store.state.getCartsList.count_cart;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/variables";

  .toolbar {
    position: fixed;
    top: 150px;
    right: 0;
    z-index: 500;
    width: 50px;
    font-size: 24px;
    text-align: center;
    color: white;
    background: rgba(0, 0, 0, 0.5);

    .red-point {
      position: absolute;
      top: 10px;
      right: -2px;
      font-size: 12px;
      padding: 1px 4px;
      background: $g-highlight;
      line-height: 1;
      border-radius: 2000px;
    }

    .border-b {
      border-bottom: 1px solid #9b9b9b;
    }

    .one-block {
      position: relative;
      height: 60px;
      line-height: 60px;
      box-sizing: border-box;
      cursor: pointer;
    }

    .content {
      .a-wrap {
        color: white;
        display: block;
        padding: 0 6px;

        &:hover {
          background: $g-highlight;

          .red-point {
            color: $g-highlight;
            background: white;
          }
        }
      }
    }
  }
</style>
