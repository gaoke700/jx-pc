<template>
  <div class="shop-header">
    <div class="container g-clearfix">
      <template v-if="storeInfoModule.logo">
        <div v-if="!isShop" class="shop-logo" :style="{backgroundImage:`url(${storeInfoModule.logo})`}"></div>
      </template>
      <template v-else>
        <div class="shop-logo"></div>
      </template>
      <div class="shop-info">
        <div class="name">
          <p class="name-text" :class="{ 'hover': isShowShopInfo }" @mouseover="showShopInfo" @mouseout="hideShopInfo">
            {{storeInfoModule.store_name || shopList.store_name}}</p>
          <div class="bz">
            <ul>
              <li v-for="cert in certList" v-if="cert.status">{{cert.title}}</li>
            </ul>
          </div>
          <div class="shop-list" v-if="isShowShopInfo" @mouseover="showShopInfo" @mouseout="hideShopInfo">
            <ul>
              <li v-if="shopList.qq"><p class="tubiao tubiao-qq"></p>
                <p class="title">QQ号：</p>
                <p class="text">{{shopList.qq}}</p></li>
              <li v-if="shopList.wechat"><p class="tubiao tubiao-wechat"></p>
                <p class="title">微信号：</p>
                <p class="text">{{shopList.wechat}}</p></li>
              <li v-if="shopList.phone"><p class="tubiao tubiao-phone"></p>
                <p class="title">客服电话：</p>
                <p class="text">{{shopList.phone}}</p></li>
              <li v-if="shopList.service_time"><p class="tubiao tubiao-service-time"></p>
                <p class="title">服务时间：</p>
                <p class="text">{{shopList.service_time}}</p></li>
              <li v-if="shopList.addr"><p class="tubiao tubiao-addr"></p>
                <p class="title">联系地址：</p>
                <p class="text">{{shopList.addr}}</p></li>
              <li v-if="shopList.company_name"><p class="tubiao tubiao-company-name"></p>
                <p class="title">公司名称：</p>
                <p class="text">{{shopList.company_name}}</p></li>
              <li v-if="shopList.mobile"><p class="tubiao tubiao-mobile"></p>
                <p class="title">手机号码：</p>
                <p class="text">{{shopList.mobile}}</p></li>
              <!--<li v-for="item in shopMore"><p class="title">{{item}}：</p><p class="text">{{item}}</p></li>-->
            </ul>
          </div>
        </div>
        <!--<div class="func">
          <a class="collection-no" href="">店铺收藏</a>
          <a class="collection" href="">已收藏</a>
          <a class="contact" href="">联系卖家</a>
        </div>-->
      </div>
      <div class="shop-qr-code" v-if="shopList.qrcode_url">
        <img :src="shopList.qrcode_url">
        <p class="text">扫一扫二维码<br/>关注店铺公众号</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import ApiStore from '../../api/store';
  import Utils from '../../utils/utils';

  export default {
    data() {
      return {
        timeout: null,
        isShowShopInfo: false,
        certList: {},
      };
    },
    created() {
      this.getIndexModule();
      ApiStore.getStoreCert().then((res) => {
        this.certList = res.CertList;
      });
    },
    computed: {
      storeInfoModule() {
        return (
          (this.$store.state.indexModule.store && this.$store.state.indexModule.store[0]) || {});
      },
      shopList() {
        return this.$store.state.storeInfo;
      },
      isShop() {
        return Utils.isShop();
      },
    },
    methods: {
      showShopInfo() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isShowShopInfo = true;
        }, 150);
      },
      hideShopInfo() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isShowShopInfo = false;
        }, 150);
      },
      ...mapActions(['getIndexModule']),
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";
  @import "../../styles/variables";

  .bz {
    padding-left: 10px;

    ul {
      font-size: 0;
    }

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 20px;
      font-size: 12px;
      line-height: 28px;
      color: #666666;
      background: url("~assets/images/rz.png") no-repeat left center;
    }
  }

  .shop-header {
    background: url("../../assets/images/shop-header/bg.jpg") center no-repeat #e8e8e8;
    .container {
      position: relative;
      padding: 15px 0;

      .shop-logo {
        float: left;
        width: 200px;
        height: 90px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }

      .shop-info {
        float: left;
        padding-left: 10px;
        margin-top: 5px;

        .name {
          position: relative;
          z-index: 51;
          padding: 5px 0 0;

          .name-text {
            position: relative;
            z-index: 1;
            display: inline-block;
            padding: 0 10px;
            margin-bottom: 5px;
            font-size: 18px;
            line-height: 35px;
            cursor: pointer;
            border: 1px solid transparent;
          }

          .hover {
            border-color: #e3e3e3;
            border-bottom-color: white;
            background: white;
          }

          .shop-list {
            position: absolute;
            top: 41px;
            left: 0;
            min-width: 368px;
            background: white;
            border: 1px solid #eeeeee;
            box-shadow: 1px 1px 2px #eeeeee;

            ul {
              padding: 0 12px;
            }

            li {
              padding: 12px 0;
              border-bottom: 1px solid #eeeeee;

              p {
                display: inline-block;
                vertical-align: top;
              }

              p.tubiao {
                width: 16px;
                height: 18px;
                margin-right: 9px;
                background-image: url('~assets/images/common/icon-images.png');
                background-repeat: no-repeat;
                &-qq {
                  background-position: -82px -101px;
                }
                &-wechat {
                  background-position: -98px -101px;
                }
                &-phone {
                  background-position: -83px -84px;
                }
                &-service-time {
                  background-position: -101px -84px;
                }
                &-addr {
                  background-position: -117px -84px;
                }
                &-company-name {
                  background-position: -132px -84px;
                }
                &-mobile {
                  background-position: -67px -101px;
                }
              }

              .title {
                color: $g-highlight;
              }

              .text {
                padding: 0 5px;
                color: #888888;
              }

              &:last-child {
                border-bottom: 0;
              }
            }
          }
        }

        .func {
          padding: 5px 0;

          a {
            display: inline-block;
            height: 21px;
            padding: 0 10px 0 26px;
            margin-right: 10px;
            line-height: 21px;
            color: white;
            vertical-align: top;
            background-color: $g-highlight;
            background-repeat: no-repeat;
            background-position: 8px center;
            border-radius: 12px;
          }

          .collection-no {
            background-image: url("~assets/images/shop-header/collection-no.png");
          }

          .collection {
            background-color: #282724;
            background-image: url("~assets/images/shop-header/collection.png");
          }

          .contact {
            background-color: #5b95ce;
            background-image: url("~assets/images/shop-header/contact.png");
          }
        }
      }

      .shop-qr-code {
        position: absolute;
        top: 0;
        right: 0;
        width: 90px;
        padding: 5px;
        background: $g-highlight;

        img {
          display: block;
          width: 90px;
          height: 90px;
        }

        .text {
          padding: 5px 0 0;
          color: white;
          text-align: center;
        }
      }
    }
  }
</style>
