<template>
  <div class="toolbar">
    <div class="content">
      <a class="cart"  href="cart.html">
          <div class="cart-tubiao"></div>
          <div class="cart-text">购物车</div>
          <div class="cart-num">{{countCart}}</div>
      </a>
      <a class="tubiao-order tubiao-wrap js-page-wodedingdan" href="my-order.html">
        <div class="hover-content">
          <p class="text">我的订单</p>
        </div>
      </a>
<!--
      <div class="tubiao-collection tubiao-wrap">
        <div class="hover-content">
          <p class="text">我的收藏</p>
        </div>
      </div>
-->
      <div class="tubiao-qr-code tubiao-wrap" v-if="storeInfo.qrcode_url">
        <div class="hover-content">
          <div class="qr-code">
            <img :src="storeInfo.qrcode_url" />
            <p class="text">关注公众号</p>
          </div>
        </div>
      </div>

    </div>
    <div class="return-top tubiao-wrap" @click="goTop">
      <div class="hover-content">
        <p class="text">返回顶部</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    methods: {
      goTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
    },
    created() {
    },
    computed: {
      countCart() {
        return this.$store.state.getCartsList.count_cart;
      },
      storeInfo() {
        return this.$store.state.storeInfo;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";

  .toolbar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 500;
    width: 40px;
    height: 100%;
    color: white;
    background: #222222;

    .content {
      position: absolute;
      top: 150px;

      .cart {
        display: block;
        padding: 20px 0;
        color: #aaaaaa;
        text-align: center;
        cursor: pointer;
        background: #393939;

        .cart-tubiao {
          width: 40px;
          height: 40px;
          background-image: url("../../assets/images/toolbar/cart.png");
          background-repeat: no-repeat;
          background-position: center;
        }

        .cart-text {
          padding: 0 10px;
          font-size: 14px;
        }

        .cart-num {
          display: inline-block;
          min-width: 20px;
          min-height: 20px;
          margin-top: 5px;
          line-height: 18px;
          color: white;
          background: $g-highlight;
          border-radius: 50%;
        }

        &:hover {
          color: white;
          background: $g-highlight;

          .cart-num {
            color: $g-highlight;
            background: white;
          }

          .cart-tubiao {
            background-color: $g-highlight;
            background-image: url("../../assets/images/toolbar/cart-hover.png");
          }
        }
      }
    }

    .tubiao-wrap {
      display: block;
      position: relative;
      width: 40px;
      height: 40px;
      margin-top: 20px;
      cursor: pointer;
      color: white;
      background-repeat: no-repeat;
      background-position: center;

      &::after {
        position: absolute;
        top: 50%;
        display: block;
        width: 0;
        height: 0;
        content: '';
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 6px solid #222222;
        transform: translateY(-50%);
      }

      .hover-content {
        position: absolute;
        top: 50%;
        right: 40px;
        display: none;
        min-width: 100px;
        line-height: 40px;
        text-align: center;
        background: #393939;
        transform: translateY(-50%);
      }

      .qr-code {
        padding: 10px 10px 0;

        img {
          display: block;
          width: 110px;
          height: 110px;
        }
      }

      &:hover {
        background-color: $g-highlight;

        .hover-content {
          display: block;
        }
      }
    }

    .return-top {
      position: absolute;
      bottom: 20px;

      @include toolbar-path-gen(return-top);
    }

    .tubiao-order {
      @include toolbar-path-gen(order);
    }

    .tubiao-collection {
      @include toolbar-path-gen(collection);
    }

    .tubiao-qr-code {
      @include toolbar-path-gen(qr-code);
    }
  }
</style>
