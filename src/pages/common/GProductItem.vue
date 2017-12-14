<template>
  <a :href="'detail.html?goods_id=' + info.goods_id"
     class="g-product-item"
     :class="{
      'g-product-item-show-cart':isShowCart
    }">
    <!--backgroundImage: `url(${info.thumbnail_pic})`,-->
    <div class="g-product-view" v-lazy:background-image="info.thumbnail_pic"
      :style="{
        width: imgStyle.width?imgStyle.width:imgStyle.height,
        height: imgStyle.height?imgStyle.height:imgStyle.width
      }">
    </div>
    <div
      class="g-product-info"
      :style="{
        width: imgStyle.width
      }">
      <div
        class="g-product-info-name"
        v-text="info.name">
      </div>
      <div class="g-product-info-price">
        <div
          class="g-product-info-price-item g-product-info-price-icon"
          :style="priceStyle">
          ￥
        </div>
        <div
          class="g-product-info-price-item g-product-info-price-text"
          :style="priceStyle"
          v-text="info.price">
        </div>
        <div
          class="g-product-info-price-item g-product-info-price-mark"
          v-for="value in mark"
          v-text="value">
        </div>
        <div
          class="g-product-info-price-item g-product-info-cart iconfont icon-cart"
          :style="cartStyle"
          @click.stop="addCart">
        </div>
      </div>
    </div>
  </a>
</template>

<script>
  export default {
    props: {
      info: {
        type: Object,
        default() {
          return {
            thumbnail_pic: '',
            name: '标题',
            price: '9999.99',
            goods_id: '',
          };
        },
      },
      imgStyle: {
        type: Object,
        default() {
          return {
            // width: '285px',
            // height: '285px'
          };
        },
      },
      priceStyle: {
        type: Object,
        default() {
          return {
            // fontSize: '24px'
          };
        },
      },
      cartStyle: {
        type: Object,
        default() {
          return {
            // width: '50px',
            // height: '26px'
          };
        },
      },
    },
    mounted() {
    },
    computed: {
      mark() {
        return [];
      },
      isShowCart() {
        return false;
      },
    },
    data() {
      return {};
    },
    methods: {
      addCart() {
        console.log('加入购物车待续');
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";
  @import "../../styles/variables";

  $width: 285px;
  $highlight: $g-highlight;

  .g-product-item {
    box-sizing: border-box;
    display: inline-block;
    transition: 0.4s;

    .g-product-view {
      width: $width;
      height: $width;
      background: #cccccc center center no-repeat;
      background-size: cover;
    }

    .g-product-info {
      position: relative;
      box-sizing: border-box;
      width: $width;
      height: 110px;
      padding: 14px 10px 0;

      .g-product-info-name {
        height: 48px;
        overflow: hidden;
        font-size: 14px;
        line-height: 24px;
        color: #333333;
        text-align: justify;
      }

      .g-product-info-price {
        text-align: left;
        position: relative;
        padding-top: 10px;
        font-size: 0;
        line-height: 1;
        color: $g-highlight;

        .g-product-info-price-item {
          display: inline-block;
          font-size: 24px;
          vertical-align: middle;

          &.g-product-info-price-mark {
            width: 30px;
            height: 18px;
            margin-left: 8px;
            font-size: 12px;
            line-height: 18px;
            color: #ffffff;
            text-align: center;
            background: $highlight;
            border-radius: 4px;
          }
        }

        .g-product-info-cart {
          position: absolute;
          right: 0;
          bottom: 0;
          display: none;
          padding: 0 10px;
          font-size: 20px;
          line-height: 26px;
          color: #ffffff;
          text-align: center;
          background: #282724;
          border-radius: 100px;
          transition: 0.4s;
        }
      }
    }

    // 显示购物车
    &.g-product-item-show-cart {
      .g-product-info {
        .g-product-info-cart {
          display: block;
        }
      }
    }

    // 鼠标滑过
    &:hover {
      background: #ffffff;
      box-shadow: 0 0 20px #dddddd;

      .g-product-info {
        .g-product-info-cart {
          background: $highlight;
        }
      }
    }
  }
</style>
