<template>
  <layout-all class="my-coupons-wrap" :current-url="'my-coupons.html'">
    <div class="content-header">优惠券</div>
    <div class="content-body">
      <template v-if="coupon.count1 > 0">
        <div class="tab-wrap">
          <ul class="g-clearfix">
            <li :class="{'curr' : status == 0}" @click="changeStatus(0)">全部&nbsp;<span
              class="cred">{{coupon.count1}}</span></li>
            <li :class="{'curr' : status == 1}" @click="changeStatus(1)">可用&nbsp;<span
              class="cred">{{coupon.count2}}</span></li>
            <li :class="{'curr' : status == 2}" @click="changeStatus(2)">已使用&nbsp;<span
              class="cred">{{coupon.count3}}</span></li>
            <li :class="{'curr' : status == 3}" @click="changeStatus(3)">已过期&nbsp;<span
              class="cred">{{coupon.count4}}</span></li>
          </ul>
        </div>
        <div class="coupons-wrap g-clearfix">
          <div class="shop-coupons-wrap" v-for="(list, index) in coupon.list">

            <div class="shop-info-hd g-clearfix">
              <p class="fl">{{list.store_name}}</p>
              <a :href="list.store_url" class="fr">进入店铺</a>
              <a href="javascript:;" class="fr mr20" v-if="list.coupon_list.length > 4" @click="showMore(index)">查看更多</a>
            </div>

            <div class="shop-coupons-item-wrap" v-if="list.coupon_list.length > 0">
              <div class="shop-coupons-item-w" v-for="(couponList, index) in list.coupon_list" v-if="index < list.showMaxNum">
                <div class="shop-coupons-item" :class="{'shop-coupons-item-failure' : couponList.couponStatus != 1}">
                  <div class="semicircle semicircle-l"></div>
                  <div class="semicircle semicircle-r"></div>
                  <div class="coupons-price g-clearfix">
                    <div class="fl price">￥<span>{{couponList.price}}</span></div>
                    <a class="fr btn-use" :href="list.store_url" v-if="couponList.couponStatus == 1">{{btnText[couponList.couponStatus]}}</a>
                    <div class="fr btn-use" v-else>{{btnText[couponList.couponStatus]}}</div>
                  </div>
                  <div class="coupons-des">
                    <p><span>使用条件：</span>{{usedNumText(couponList.min_payment_amount)}}</p>
                    <p><span>使用期限：</span>{{couponList.begin_time}} 至 {{couponList.end_time}}</p>
                    <p><span>使用说明：</span>{{desText[couponList.type_id]}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="f12 tc" v-else>此栏目暂无优惠券数据</div>

          </div>
        </div>
      </template>
      <div v-else class="coupons-no-data">
        <img src="~assets/images/my/coupons/no-coupons.png">
        <div class="msg-wrap">
          <p class="msg">您尚未获得任何优惠券</p>
          <p class="home"><a href="index.html">返回首页</a></p>
        </div>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import LayoutAll from '../my-layout/LayoutAll';
  import ApiCoupons from '../../api/coupons';

  export default {
    components: {
      LayoutAll,
    },

    data() {
      return {
        coupon: {
          count1: 0,
          count2: 0,
          count3: 0,
          count4: 0,
          list: [],
        },
        btnText: ['', '立即使用', '已使用', '已过期'],
        desText: ['本店全部商品', '本店指定商品'],
        status: 0,
      };
    },
    computed: {},

    methods: {
      usedNumText(params) {
        let text = '无条件';
        if (params > 0) {
          text = `满${params}元可使用`;
        }
        return text;
      },
      changeStatus(status) {
        this.status = status || 0;
        this.getCouponList();
      },
      getCouponList() {
        ApiCoupons.getCouponList({
          status: this.status,
        }).then((data) => {
          data.list = data.list || [];
          data.list.forEach((item) => {
            item.showMaxNum = 4;
          });
          this.coupon = Object.assign(this.coupon, data);
        });
      },
      showMore(index) {
        this.coupon.list[index].showMaxNum = this.coupon.list[index].coupon_list.length;
      },
    },

    created() {
      this.getCouponList();
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .my-coupons-wrap {
    .content-header {
      height: 50px;
      padding-left: 20px;
      line-height: 50px;
      font-size: 14px;
      background-color: white;
      font-weight: bold;
    }

    .content-body {
      background-color: white;
      margin-top: 20px;

      .tab-wrap {
        padding: 10px 20px 0;

        li {
          float: left;
          margin-right: 50px;
          font-size: 16px;
          cursor: pointer;

          &.curr {
            height: 27px;
            border-bottom: 3px solid $g-highlight;
            color: $g-highlight;
          }

          &.disable {
            cursor: not-allowed;
            opacity: 0.5;
          }
        }
      }

      .coupons-wrap {
        padding: 20px 20px 0;
      }

      .shop-coupons-wrap {
        margin-bottom: 40px;
        overflow: hidden;
      }

      .shop-info-hd {
        margin-bottom: 20px;
        padding: 0 20px;
        background: #f7f7f7;
        border: 1px solid #dddddd;
        line-height: 38px;
        p {
          font-weight: bold;
        }
        a {
          color: #006de7;
        }
      }

      .shop-coupons-item-wrap {
        font-size: 0;
        width: 1056px;
      }

      .shop-coupons-item-w {
        font-size: 12px;
        display: inline-block;
        vertical-align: top;
        overflow: hidden;
        margin: 0 10px 10px 0;
      }

      .shop-coupons-item {
        border: 1px solid #e7e5df;
        width: 252px;
        position: relative;

        .semicircle {
          position: absolute;
          top: 63px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e7e5df;

          &-l {
            left: -11px;
          }

          &-r {
            right: -11px;
          }
        }

        .coupons-price {
          line-height: 40px;
          padding: 15px;
          color: $g-highlight;

          .price {
            font-size: 20px;

            span {
              font-size: 30px;
              font-weight: bold;
            }
          }

          .btn-use {
            display: block;
            border: 1px solid $g-highlight;
            text-align: center;
            width: 80px;
            line-height: 24px;
            border-radius: 2px;
            margin-top: 9px;
            cursor: pointer;
            color: $g-highlight;
            font-weight: bold;
          }
        }

        .coupons-des {
          padding: 10px 15px;
          border-top: 1px dashed #dddddd;
          background: #fbfbfb;
          line-height: 22px;

          span {
            color: #888888;
          }
        }

        &-failure {
          color: #888888;

          .coupons-price {
            color: #888888;

            .btn-use {
              border: 1px solid #888888;
              cursor: default;
              color: #888888;
            }
          }
        }
      }

      .coupons-no-data {
        position: relative;
        height: 470px;
        margin-top: 20px;
        background-color: white;

        .text {
          padding: 20px;
          font-size: 14px;

          em {
            color: $g-highlight;
          }

          span {
            font-size: 12px;
            color: #888888;
            padding-left: 20px;
          }
        }

        img {
          text-align: center;
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
        }

        .msg-wrap {
          position: absolute;
          bottom: 100px;
          width: 100%;
          text-align: center;
        }

        .msg {
          margin-bottom: 20px;
          font-size: 16px;
          color: #888888;
        }

        .home {
          font-size: 14px;
          text-decoration: underline;
        }
      }
    }
  }
</style>
