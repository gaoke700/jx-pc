<template>
  <layout-all class="my-index-wrap" :current-url="'my-index.html'">
    <div class="user-info g-clearfix">
      <div class="avatar-wrap">
        <img :src="`${memberInfo.userface}`">
      </div>
      <div class="info-content">
        <header>{{ memberInfo.name}}</header>
        <div class="info-wrap">
          <!--账户总积分-->
          <!--<span>{{ memberInfo.name}}</span>-->
          <!--<a href="#">查看积分记录></a>-->
          <b class="info-coupon">会员卡<span>{{ memberCardCount }}张</span></b>
          <a href="my-member-card.html">查看></a>
          <b class="info-coupon">优惠劵<span>{{ couponCount }}张</span></b>
          <a href="my-coupons.html">查看></a>
        </div>
        <ul class="info-order">
          <li>待付款<span>{{ orderList.order_ready_pay_count || 0 }}</span></li>
          <li>待收货<span>{{ orderList.order_in_shipping_count || 0 }}</span></li>
          <li>待自提<span>{{ orderList.order_since_count || 0 }}</span></li>
          <li>待评价<span>{{ orderList.order_ready_comment_count || 0 }}</span></li>
          <li>退款退货<span>{{ refundCount }}</span></li>
        </ul>
      </div>
    </div>
    <div class="order-wrap">
      <div class="order-panel" v-if="orderList.count > 0">
        <table class="">
          <thead>
          <tr>
            <td colspan="6">
              <span class="title">我的订单</span>{{lookMoreList.page}}{{lookMoreList.page_count}}
              <a href="my-order.html" class="more">查看全部订单</a>
            </td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in orderList.data">
            <td>
              <div class="pic">
                <a href="#" v-for="(v, index) in item.goods_info" v-if="index <= 2"><img
                  :src="`${v.thumbnail_pic}`"></a>
              </div>
            </td>
            <td>{{ item.ship_name }}</td>
            <td>￥{{ item.total_amount }}</td>
            <td>
              <p>{{ item.createtime | dateFormat('YYYY-MM-DD') }}</p>
              <p>{{ item.createtime | dateFormat('HH:mm:ss') }}</p>
            </td>
            <td>
              <p class="status">{{ item.order_status }}</p>
              <delivery-popover
                :orderId="item.order_id"
                :siteId="item.storeInfo.site_id"
                :memberId="item.member_id"
                :delivery="item.delivery"
                v-if="item.order_status === '待收货'">
                <a class="logistics" href="javascript:;">查看物流</a>
              </delivery-popover>
            </td>
            <td><a class="look"
                   :href="`my-order-${item.order_status === '已取消' ? 'canceled' : 'detail'}.html?order_id=${item.order_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`">查看</a>
            </td>
          </tr>
          </tbody>
        </table>
        <p class="see-more" :class="{ 'no' : isShowMore }">
          <a href="javascript:;" @click="lookMore()">查看更多订单 ></a>
        </p>
      </div>

      <div class="ui-no-data" v-else>
        <img src="~assets/images/my/order/no-order.png"/>
        <p class="ui-no-data-text">您还没有任何订单，快去选购好货</p>
        <p class="ui-no-data-target"><a href="index.html">返回首页</a></p>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import memberInfo from 'api/member-info';
  import memberOrder from 'api/member-order';
  import ApiCouponsList from 'api/coupons';
  import memberCardList from 'api/member-card-list';
  import LayoutAll from '../my-layout/LayoutAll';
  import DeliveryPopover from '../my-order/DeliveryPopover';

  export default {
    components: {
      LayoutAll,
      DeliveryPopover,
    },

    data() {
      return {
        memberInfo: [],
        orderList: [],
        newOrderList: [],
        lookMoreList: [],
        memberCardCount: 0,
        couponCount: 0,
        refundCount: 0,
        currentPage: 2,
        defaultPageSize: 5,
        lookUrl: '',
        isShowMore: false,
      };
    },

    methods: {
      getMemberInfo(params) {
        memberInfo.getMemberInfo(params).then((data) => {
          this.memberInfo = data;
        });
      },

      getList() {
        memberOrder.getList({
          page: 1,
          page_size: this.defaultPageSize,
        }).then((data) => {
          this.orderList = data;
          if (this.orderList.page_count === 1) {
            this.isShowMore = true;
          }
        });
      },

      getMemberList(params) {
        memberCardList.getMemberList(params).then((data) => {
          this.memberCardCount = data.count || 0;
        });
      },

      getCouponList(params) {
        ApiCouponsList.getCouponList(params).then((data) => {
          this.couponCount = data.count1 || 0;
        });
      },

      getRefundCount(params) {
        memberOrder.getRefundOrderList(params).then((data) => {
          this.refundCount = data.count || 0;
        });
      },

      lookMore() {
        memberOrder.getList({
          page: this.currentPage,
          page_size: this.defaultPageSize,
        }).then((res) => {
          this.lookMoreList = res;
          this.newOrderList = this.formatData(res.data);
          this.currentPage = this.currentPage + 1;
          if (this.lookMoreList.page === this.lookMoreList.page_count) {
            this.isShowMore = true;
          }
        });
      },

      formatData(data) {
        if (!data) return this.orderList;
        data.forEach((item) => {
          this.orderList.data.push(item);
        });
        return this.orderList;
      },
    },

    created() {
      this.getMemberInfo();
      this.getList();
      this.getMemberList();
      this.getCouponList();
      this.getRefundCount();
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  $red: $g-highlight;
  .my-index-wrap {
    .user-info {
      display: inline-block;
      width: 100%;
      height: 161px;
      background-color: white;
      border-top: 5px solid #efefef;
      border-bottom: 5px solid #efefef;

      .avatar-wrap {
        float: left;
        margin: 25px 0 0 50px;
        width: 110px;
        height: 110px;
        border-radius: 100%;

        img {
          width: 100px;
          height: 100px;
          border-radius: 100%;
          box-shadow: #efefef 0 0 0 5px;
          margin: 5px 0 0 5px;
        }
      }

      .info-content {
        height: 100%;
        margin-left: 220px;
        margin-top: 30px;

        header {
          font-size: 18px;
          color: #333333;
        }

        .info-wrap {
          margin-top: 20px;
          margin-bottom: 32px;
          font-size: 14px;
          color: #4a4a4a;
          span {
            display: inline-block;
            margin: 0 6px;
            color: $red;
          }

          a {
            display: inline-block;
            margin-right: 50px;
            color: #006de7;
          }
        }

        .info-order {
          width: 699px;
          height: 38px;
          padding: 10px 0;
          border: 1px solid #dddddd;
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.13);
          background: #ffffff;

          li {
            float: left;
            width: 139px;
            line-height: 38px;
            border-right: 1px dashed #dddddd;
            font-size: 14px;
            color: #4a4a4a;
            text-align: center;

            &:last-child {
              border-right: 0;
            }

            span {
              display: inline-block;
              margin-left: 5px;
              color: $red;
            }
          }
        }
      }
    }

    .order-wrap {
      margin: 50px 0 20px;
      padding: 0 20px 20px;
      background-color: white;

      .order-panel {
        table {
          width: 100%;
          max-height: 800px;

          .title {
            font-size: 14px;
          }

          .more {
            float: right;
            color: #666666;
          }

          td {
            padding: 18px;

            .pic {
              height: 60px;
              text-align: left;
              font-size: 0;

              a {
                margin-left: 10px;
              }

              img {
                width: 60px;
                height: 60px;
              }
            }
          }

          tbody {
            border-bottom: 1px solid #e9ecef;

            tr {
              border-top: 1px solid #e9ecef;
            }

            td {
              text-align: center;

              .status {
                font-weight: bold;
                color: $g-highlight;

                .finish {
                  color: #4c8b03;
                }
              }

              .logistics {
                // display: block;
                color: #333333;
              }

              .look {
                color: #666666;
              }
            }
          }
        }

        .see-more {
          text-align: center;
          margin-top: 20px;

          &.no {
            display: none;
          }

          a {
            color: #888888;
          }
        }
      }
    }

    .goods {
      margin-bottom: 20px;
      padding: 0 20px 30px;
      background-color: white;

      .goods-th {
        height: 30px;
        line-height: 30px;
        padding: 10px 0 15px;
        li {
          float: left;
          margin-right: 45px;
          border-bottom: 3px solid white;
          font-size: 16px;
          color: #000000;
          cursor: pointer;
          &.on {
            border-bottom-color: $red;
            color: $red;
          }
          span {
            display: inline-block;
            margin-left: 5px;
          }
        }
      }

      .goods-td {

        li {
          display: none;

          &.on {
            display: block;
          }

          .goods-list {
            float: left;
            width: 220px;
            margin-right: 42px;

            &:last-child {
              margin-right: 0;
            }
            .img-box {
              width: 100%;
              height: 265px;
              text-align: center;
              background-color: #efefef;

              img {
                max-width: 100%;
                max-height: 100%;
                vertical-align: middle;
              }
            }

            .price {
              line-height: 40px;

              span {
                font-size: 16px;
                color: #fa0321;
              }

              del {
                font-size: 12px;
                color: #d0ced1;
              }
            }

            p {
              line-height: 18px;
              font-size: 12px;
              color: #000000;
            }
          }
        }
      }
    }
  }
</style>
