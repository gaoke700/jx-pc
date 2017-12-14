<template>
  <div
    v-if="goodsList.length"
    class="container g-product-recommend">
    <div
      v-if="isShowTitle"
      class="g-product-recommend-title">
      <span v-text="title"></span>
    </div>
    <div
      @mouseover="autoPlayClose"
      @mouseout="autoPlay"
      class="g-product-recommend-main">
      <a
        v-if="goodsList.length>4"
        @click="prev" class="g-product-recommend-prev iconfont icon-angle-left" href="javascript:void(0);"></a>
      <a
        v-if="goodsList.length>4"
        @click="next" class="g-product-recommend-next iconfont icon-angle-right" href="javascript:void(0);"></a>
      <a
        v-for="v in goodsList"
        :href="`detail.html?goods_id=${v.goods_id}`" class="g-product-recommend-item">
        <g-product-item
          :info="v"
          :priceStyle="{fontSize:'18px'}"
          :imgStyle="{width:'240px'}"></g-product-item>
      </a>
    </div>
  </div>
</template>

<script>
  import recommend from '../../api/recommend';
  import GProductItem from '../common/GProductItem.vue';

  export default {
    props: {
      recType: {
        type: Number,
        default: 4,
      },
      title: {
        type: String,
        default: '商品推荐',
      },
      isShowTitle: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        timer: null,
        goodsList: [{ price: 10.00 }, {}, {}, {}, {}],
      };
    },
    created() {
      // 商品推荐
      recommend.getList({ recType: this.recType }).then((data) => {
        this.goodsList = data.data.goodsList || [];
        this.$emit('ajaxover', this.goodsList);
      });
    },
    mounted() {
      this.autoPlay();
    },
    methods: {
      prev() {
        this.goodsList.unshift(this.goodsList.pop());
      },
      next() {
        this.goodsList.push(this.goodsList.shift());
      },
      autoPlay() {
        if (this.goodsList.length > 4) {
          this.timer = setInterval(() => {
            this.next();
          }, 5000);
        }
      },
      autoPlayClose() {
        clearInterval(this.timer);
      },
    },
    components: {
      GProductItem,
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";

  .g-product-recommend {
    margin-bottom: 50px;
    margin-top: 40px;
    .g-product-recommend-title {
      span {
        display: inline-block;
        padding-bottom: 4px;
        margin-bottom: 10px;
        font-size: 14px;
        border-bottom: 2px solid $g-highlight;
      }
    }
    .g-product-recommend-main {
      position: relative;
      @include clearfix();
      height: 400px;
      padding-left: 2px;
      text-align: center;
      overflow: hidden;
      .g-product-recommend-next,
      .g-product-recommend-prev {
        position: absolute;
        width: 45px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        top: 50%;
        margin-top: -50px;
        background: rgba(170, 170, 170, 0.4);
        color: #888888;
        z-index: 3;
        font-size: 28px;
        display: none;
      }
      .g-product-recommend-next {
        right: 2px;
      }
      .g-product-recommend-prev {
        left: 1px;
      }
      &:hover {
        .g-product-recommend-next,
        .g-product-recommend-prev {
          display: block;
          // background: rgba(136, 136, 136, 0.6);
        }
      }
      .g-product-recommend-item {
        height: 400px;
        box-sizing: border-box;
        float: left;
        padding: 20px 0 28px;
        width: 300px;
        border: 1px dashed #aaaaaa;
        margin-left: -1px;
        position: relative;
        &:hover {
          border: 1px solid $g-highlight;
          z-index: 2;
        }
      }
    }
  }

</style>
