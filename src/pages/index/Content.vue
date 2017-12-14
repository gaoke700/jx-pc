<template>
  <div class="page-content">
    <carousel trigger="click" arrow="never" height="600px" v-if="banners[0] && banners[0].img" :interval="bannerInterval">
      <carousel-item v-for="banner in banners" :key="banner.img">
        <a class="banner-img" :href="banner.link" :style="{backgroundImage:`url(${banner.img})`}"></a>
        <!--<img :src="banner.img"/>-->
      </carousel-item>
    </carousel>
    <div class="container">
      <div class="page-column" :class="adData.className" v-if="adData.adItems && adData.adItems[0] && adData.adItems[0].img">
        <a v-for="adItem in adData.adItems" class="page-column-item" :href="adItem.link" :style="{ backgroundImage: 'url(\'' + adItem.img + '\')' }"></a>
      </div>
      <div v-if="productList.length > 0" v-for="(value, index) in productList">
        <g-product-title :title="value.name"></g-product-title>
        <div class="page-product">
          <div class="tc" v-if="!productItem[index]">暂无数据</div>
          <div v-for="(value, index) in productItem[index]" :style="{ marginRight: (index + 1) % 4 === 0 ? 0 : '' }" class="page-product-item-wrap">
            <g-product-item :info="value" :imgStyle="{ width: '285px', height: '285px' }"></g-product-item>
          </div>
        </div>
      </div>
      <div v-if="productList.length <= 0" class="no-product">
        <img src="~assets/images/index/no-goods.png" />
        <p>商品即将上架，敬请期待！</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { Carousel, CarouselItem } from 'components/carousel';
  import GProductItem from '../common/GProductItem';
  import GProductTitle from '../common/GProductTitle';
  import ApiGoodsList from '../../api/goods-list';

  export default {
    data() {
      return {
        productItem: {},
      };
    },
    components: {
      Carousel,
      CarouselItem,
      GProductItem,
      GProductTitle,
    },
    created() {
      this.getIndexModule();
    },
    computed: {
      banners() {
        const indexModule = this.$store.state.indexModule;
        return ((indexModule.sliderImg && indexModule.sliderImg.img) || []);
      },
      bannerInterval() {
        const indexModule = this.$store.state.indexModule;
        const defaultTime = 3000;
        if (indexModule.sliderImg && indexModule.sliderImg.time) {
          return +indexModule.sliderImg.time || defaultTime;
        }
        return defaultTime;
      },
      adData() {
        const indexModule = this.$store.state.indexModule;
        const ad = indexModule.ad || {};
        const type = ad.type || 1;
        return {
          adItems: (ad.img && ad.img[type]) || [],
          className: `page-column-${type}`,
        };
      },
      productList() {
        const indexModule = this.$store.state.indexModule;
        const productList = indexModule.productList || [];
        return productList;
      },
    },
    methods: {
      ...mapActions(['getIndexModule']),
      getProductList(params) {
        params.forEach((item, i) => {
          const searchType = item.type || 1;
          const searchVal = {};
          const searchData = item.data || {};
          if (searchData[searchType]) {
            if (searchType === 1 || searchType === '1') {
              if (searchData[searchType].tag) {
                searchVal.tag_id = searchData[searchType].tag;
              }
              if (searchData[searchType].price) {
                searchVal.price = searchData[searchType].price;
              }
              if (searchData[searchType].category) {
                searchVal.cat_id = searchData[searchType].category;
              }
            } else {
              searchVal.in_goods_ids = (searchData[searchType] || []).join(',');
            }
          }
          ApiGoodsList.getGoodsList(searchVal).then((res) => {
            this.$set(this.productItem, i, []);
            this.productItem[i] = res.data;
          });
        });
      },
    },
    watch: {
      productList(value) {
        this.getProductList(value);
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";

  .page-content {
    .container {
      width: $page-width;
      margin-right: auto;
      margin-left: auto;
    }
    .banner-img {
      display: block;
      width: 100%;
      height: 100%;
      background-color: white;
      background-position: center;
      background-repeat: no-repeat;
    }
    .no-product {
      padding: 100px 0;
      text-align: center;
      font-size: 18px;
      color: #888888;
      img {
        display: block;
        margin: 0 auto 40px;
      }
    }
  }

  .page-column {
    margin-top: 40px;
    margin-right: -30px;
    font-size: 0;
    text-align: justify;

    .page-column-item {
      display: inline-block;
      width: 380px;
      height: 250px;
      margin-right: 30px;
      background: #cccccc center center no-repeat;
      background-size: cover;
    }

    &-1 {
      .page-column-item {
        width: 1200px;
      }
    }

    &-2 {
      .page-column-item {
        width: 585px;
      }
    }
  }

  .page-product {
    @include clearfix();

    .page-product-item-wrap {
      float: left;
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
</style>
