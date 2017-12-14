<template>
  <div class="product-info">
    <div v-html="intro"></div>
    <!--<p class="line"></p>-->
  </div>
</template>

<script>
  import goods from 'api/goods';

  export default {
    props: {
      goodsId: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        intro: [],
      };
    },

    created() {
      goods.getIntro({ goods_id: this.goodsId }).then((data) => {
        this.intro = data.data.intro;
      });
    },
  };
</script>

<style lang="scss">
  .product-info {
    padding-top: 30px;
    padding-bottom: 30px;
    color: #666666;
    overflow-x: hidden;

    img {
      max-width: 100%;
      height: auto;
      vertical-align: top;
    }

    .item {
      display: inline-block;
      width: 33%;
      margin-bottom: 15px;
    }

    .line {
      width: 100%;
      height: 1px;
      margin-top: 15px;
      background-color: #e3e3e3;
    }
  }
</style>
