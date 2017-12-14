<template>
  <div class="site-header">
    <g-jx-logo>
      <div class="g-clearfix content" slot="right">
        <div class="search fl">
          <div class="search-form">
            <div class="search-all">
              <input placeholder="" v-model="searchVal"/>
              <div class="btn-search-all" @click="goSearch">搜本店</div>
            </div>
            <!--<div class="btn-search-site">搜本店</div>-->
          </div>
          <!--<div class="hotwords">
            <a href="" target="_blank">服装</a>
            <a href="" target="_blank">服装</a>
            <a href="" target="_blank">服装</a>
            <a href="" target="_blank">服装</a>
            <a href="" target="_blank">服装</a>
          </div>-->
        </div>
        <div class="cart fl">
          <div v-bind:class="{ 'hover': isShowCart }" :num="cartsLists.count_cart" class="cart-num"
               @mouseover="showCart" @mouseout="hideCart">购物车<span>{{countCart}}</span></div>
          <div class="cart-list" v-show="isShowCart" @mouseover="showCart" @mouseout="hideCart">
            <template v-if="cartList.length <= 0">
              <p class="no-num">购物车中还没有商品，赶紧选购吧！</p>
            </template>
            <template v-else>
              <p class="count">共{{countCart}}件商品</p>
              <div style="max-height: 486px;overflow-y: auto;">
                <div class="cart-item" v-for="item in cartList">
                  <a style="color: inherit;" :href="`detail.html?goods_id=${item.goods_id}`">
                  <img :src="item.thumbnail_pic"/>
                  <div class="name-wrap">
                    <p class="title">{{item.name}}</p>
                    <p class="guige pt5">
                      <span v-for="(value, key) in item.pdt_desc">{{key}}：<em class="color1">{{value}}</em></span>
                    </p>
                  </div>
                  <div class="edit-wrap">
                    <p class="color1">￥{{item.price}} x {{item.nums}}</p>
                    <p>&nbsp;</p>
                    <P class="pt5" style="cursor: pointer;" @click.prevent="delGoods(item.product_id, cartsLists.site_id)">删除</P>
                  </div>
                  </a>
                </div>
              </div>
              <div class="price">
                <p class="text">共<span class="color1">{{countCart}}</span>件商品，共计<span
                  class="color1">￥{{finalAmount}}</span></p>
                <a href="cart.html" class="go-cart">去购物车</a>
              </div>
            </template>
          </div>
        </div>
      </div>
    </g-jx-logo>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import GJxLogo from '../common/GJxLogo';
  import ApiCart from '../../api/carts';

  export default {
    components: {
      GJxLogo,
    },
    data() {
      return {
        timeout: null,
        searchVal: '',
        isShowCart: false,
        cartList: [],
        finalAmount: '0.00',
        countCart: 0,
      };
    },
    created() {
    },
    computed: {
      cartsLists() {
        const cartsList = this.$store.state.getCartsList;
        this.finalAmount = cartsList.final_amount;
        this.countCart = cartsList.count_cart;
        this.cartList = cartsList.product;
        return this.$store.state.getCartsList;
      },
    },
    methods: {
      goSearch() {
        window.location.href = `list.html?search_keywords=${this.searchVal}`;
      },
      showCart() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isShowCart = true;
        }, 150);
      },
      hideCart() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isShowCart = false;
        }, 150);
      },
      delGoods(productId, siteId) {
        const data = {
          type: 'del',
          data: [
            {
              site_id: siteId,
              p: [{ product_id: productId }],
            },
          ],
        };
        ApiCart.del(data).then((res) => {
          console.log(res);
          this.getCartsList();
        });
      },
      ...mapActions(['getCartsList']),
    },
  };
</script>
<style scoped lang="scss">
  @import "../../styles/theme";
  @import "../../styles/variables";

  .site-header {
    border-bottom: 1px solid #f0f0f0;

    .container {
      box-sizing: border-box;
      height: 100px;
      padding-left: 100px;
      padding-right: 100px;
    }

    .content {
      padding-top: 17px;
    }

    .search {
      .search-form {
        display: inline-block;
        font-size: 0;

        .search-all {
          display: inline-block;
          margin-right: 2px;
          border: 2px solid $g-highlight;
        }

        input {
          display: inline-block;
          width: 390px;
          height: 21px;
          padding: 5px;
          overflow: hidden;
          font-size: 12px;
          vertical-align: middle;
          border: 0;
        }

        .btn-search-all {
          display: inline-block;
          height: 31px;
          padding: 0 14px;
          font-size: 14px;
          line-height: 31px;
          color: white;
          vertical-align: middle;
          cursor: pointer;
          background: $g-highlight;
        }

        .btn-search-site {
          display: inline-block;
          width: 70px;
          height: 36px;
          font-size: 14px;
          line-height: 36px;
          color: white;
          text-align: center;
          cursor: pointer;
          background: #282724;
        }
      }

      .hotwords {
        padding-top: 4px;
        line-height: 20px;

        a {
          color: #888888;
        }
      }
    }

    .cart {
      padding-left: 30px;
      position: relative;

      .cart-num {
        position: relative;
        z-index: 101;
        width: 130px;
        height: 34px;
        font-size: 14px;
        line-height: 34px;
        color: #666666;
        text-align: center;
        cursor: pointer;
        background: white;
        border: 1px solid #e3e3e3;

        &.hover {
          border-bottom: 0;
        }

        span {
          display: inline-block;
          min-width: 18px;
          padding: 0 2px;
          margin-left: 5px;
          font-size: 12px;
          line-height: 19px;
          color: white;
          background: $g-highlight;
          border-radius: 20px;
        }
      }

      .cart-list {
        position: absolute;
        top: 34px;
        right: 0;
        z-index: 100;
        min-width: 380px;
        background: white;
        border: 1px solid #e3e3e3;
        -webkit-box-align: center;

        .color1 {
          color: #333333;
        }

        .no-num {
          padding: 10px;
          text-align: center;
        }

        .count {
          padding: 0 10px;
          line-height: 44px;
        }

        .price {
          display: -webkit-box;
          padding: 10px;
          line-height: 25px;
          border-top: 1px solid #e3e3e3;

          .text {
            -webkit-box-flex: 1;
            color: #888888;
          }

          .go-cart {
            display: block;
            width: 70px;
            height: 25px;
            color: white;
            text-align: center;
            background: $g-highlight;
          }
        }

        .cart-item {
          padding: 10px;
          overflow: auto;
          line-height: 18px;
          color: #888888;
          border-top: 1px solid #e3e3e3;

          img {
            display: block;
            float: left;
            width: 58px;
            height: 58px;
            border: 1px solid #e3e3e3;
          }

          .name-wrap {
            float: left;
            width: 180px;
            padding-left: 10px;

            .title {
              @include ellipsis2(2, 18px);
            }

            .guige {
              span {
                padding-right: 5px;
              }
            }
          }

          .edit-wrap {
            float: right;
            width: 90px;
            text-align: right;
          }
        }
      }
    }
  }

</style>
