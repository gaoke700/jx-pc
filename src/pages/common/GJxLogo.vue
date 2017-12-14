<template>
  <div class="container g-jx-logo g-clearfix">
    <div class="g-jx-mark fl">
      <a href="http://www.jdhaodian.com/" v-if="!isShop"><img src="../../assets/logo.png" /></a>
      <!--<a href="http://xyunqi.com/products/wsc" v-else><img class="img-shop" src="../../assets/images/shop-logo.jpg" /></a>-->
      <a class="img-shop" href="index.html" v-else :style="{backgroundImage:`url(${storeInfoModule.logo})`}"></a>
    </div>
    <div v-show="isShowLine" class="g-jx-line fl"></div>
    <div class="g-jx-left fl">
      <slot name="left"></slot>
    </div>
    <div class="g-jx-right fr">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Utils from '../../utils/utils';

  export default {
    props: {
      isShowLine: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    computed: {
      storeInfoModule() {
        return (
          (this.$store.state.indexModule.store && this.$store.state.indexModule.store[0]) || {});
      },
      isShop() {
        return Utils.isShop();
      },
    },
    created() {
      this.getIndexModule();
    },
    methods: {
      ...mapActions(['getIndexModule']),
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";

  .g-jx-logo {
    height: 70px;
    padding: 15px 0;

    .g-jx-line {
      height: 100%;
      margin-right: 20px;
      margin-left: 20px;
      border-left: 1px solid #dddddd;
    }

    .g-jx-left {
      font-size: 20px;
      line-height: 70px;
      color: #333333;
    }

    .g-jx-mark {
      .img-shop {
        display: block;
        width: 180px;
        height: 70px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }

      img {
        display: block;
        width: 140px;
        height: 70px;
      }
    }
  }
</style>
