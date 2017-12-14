<template>
  <div class="order-status-wrap">
    <div class="order-status-box">
      <div class="order-process g-clearfix">
        <template v-for="(item, index) in currentStatusList">
          <div class="node" :class="[item.status]">
            <div class="icon">
              <i class="iconfont" :class="[item.icon]"></i>
            </div>
            <ul>
              <li class="holder">&nbsp;</li>
              <li class="text"></li>
              <li class="track-time">
                <span class="title">{{ item.track_type }}</span> <br>
                {{ item.track_datetime | dateFormat('YYYY-MM-DD') }} <br>
                {{ item.track_datetime | dateFormat('HH:mm') }}
              </li>
            </ul>
          </div>
          <div class="proce" :class="[item.status]" v-if="index !== currentStatusList.length - 1">
            <ul>
              <li class="text" v-if="status === index">{{ item.proce_text }}</li>
            </ul>
          </div>
        </template>
      </div>
    </div>
    <div class="order-extra-box">
      <div class="extra-arrow" :style="arrowStyle"></div>
      <table>
        <tbody>
        <tr>
          <td class="order-no">订单号  {{ orderData.order_id }}</td>
          <td class="status" :class="{finish: isFinished}">
            <template>{{ statusText }}</template>
          </td>
          <td class="pay">
            <template v-if="!orderStatus.isClosed">
              <a :href="`../pay.html?order_id=${orderData.order_id}&pay_type=2`" target="_blank"
                 v-if="status === 0">付款</a>
              <a href="#order-goods" v-if="status === 1">申请退款</a>
              <a href="javascript:;" v-if="status === 2 && isCommonDelivery"
                 @click="orderConfirm({orderId: orderData.order_id, siteId: orderData.site_id, goods: orderData.items, memberId: orderData.member_id})">确认收货</a>
              <a
                :href="`my-comment.html?order_id=${orderData.order_id}&site_id=${orderData.site_id}&member_id=${orderData.member_id}`"
                target="_blank"
                v-if="(status === 3 && isCommonDelivery) || (status === 2 && !isCommonDelivery)">立即评价</a>
              <a
                :href="`my-comment-detail.html?order_id=${orderData.order_id}&site_id=${orderData.site_id}&member_id=${orderData.member_id}`"
                target="_blank"
                v-if="isFinished">查看评价</a>
            </template>
          </td>
        </tr>
        <tr>
          <template v-if="!orderStatus.isClosed">
            <!--未付款-->
            <template v-if="status === 0">
              <td></td>
              <td>
                <template v-if="orderData.surplus_pay_time_show !== '0'">
                  剩余 <span class="remain-time">{{ orderData.surplus_pay_time }}</span> 超时订单将关闭
                </template>
              </td>
              <td class="cancel">
                <a href="javascript:;" @click="orderCancel(orderData.order_id, orderData.site_id, orderData.member_id)">取消订单</a>
              </td>
            </template>
            <template v-if="status === 1">
              <td colspan="3" v-if="isCommonDelivery">等待商家发货</td>
              <td colspan="3" v-else>
              <span class="mr20">
                <el-popover
                  placement="left-start"
                  width="200"
                  :offset="20"
                  trigger="hover">
                  <a href="javascript:;" slot="reference">查看自提凭证</a>
                  <div class="store-code-wrap">
                    <p>自提订单提货凭证</p>
                    <img :src="`http://qr.wdwd.com/qr?size=150&&txt=${encodeURIComponent(orderData.mobile_url)}`"
                         alt="自提凭证">
                    <!--<img :src="`http://qr.wdwd.com/qr?size=150&&txt=${encodeURIComponent(orderData.store_code_url)}`"-->
                    <!--alt="自提凭证">-->
                    <p>扫一扫，手机查看提货凭证</p>
                  </div>
                </el-popover>
              </span>
                提货码：<span class="cred">{{ orderData.store_incode }}</span>
              </td>
            </template>

            <template v-if="status === 2">
              <td colspan="3" v-if="isCommonDelivery">等待收货中</td>
              <td colspan="3" v-else>期待您的好评</td>
            </template>
            <template v-if="status === 3">
              <td colspan="3" v-if="isCommonDelivery">期待您的好评</td>
              <td colspan="3" v-else>恭喜您！</td>
            </template>
            <template v-if="status === 4"><td colspan="3">恭喜您！</td></template>
          </template>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { DELIVERY_COMMON } from '@/common/consts';
  import commonMixin from './common';

  const ARROW_LEFT_INIT = 200; // 箭头初始距左边间距
  const ARROW_LEFT_INIT_STORE = 325; // 自提
  const PROCE_GAP = 250; // 状态间隙

  export default {
    mixins: [commonMixin],

    props: {
      orderData: {
        type: Object,
        default() {
          return {};
        },
      },
    },

    data() {
      return {
        DELIVERY_COMMON,
        deliveryType: this.orderData.delivery_type,
        isCommonDelivery: this.orderData.delivery_type === DELIVERY_COMMON,
        statusList: [ // 送货方式：普通快递
          {
            status: 'pending',
            track_type: '提交订单',
            track_datetime: this.orderData.createtime,
            proce_text: '等待付款',
            icon: 'icon-order-submit',
          },
          {
            status: 'default',
            track_type: '付款成功',
            track_datetime: this.orderData.pay_time,
            proce_text: '等待发货',
            icon: 'icon-order-succ',
          },
          {
            status: 'default',
            track_type: '商家发货',
            track_datetime: this.orderData.shipment_time,
            proce_text: '等待收货',
            icon: 'icon-order-send',
          },
          {
            status: 'default',
            track_type: '顾客收货',
            track_datetime: this.orderData.confirm_time,
            proce_text: '等待评价',
            icon: 'icon-order-take',
          },
          {
            status: 'default',
            track_type: '完成',
            track_datetime: this.orderData.finish_time,
            proce_text: '',
            icon: 'icon-order-finish',
          },
        ],
        storeStatusList: [ // 送货方式：门店自提
          {
            status: 'pending',
            track_type: '提交订单',
            track_datetime: this.orderData.createtime,
            proce_text: '等待付款',
            icon: 'icon-order-submit',
          },
          {
            status: 'default',
            track_type: '付款成功',
            track_datetime: this.orderData.pay_time,
            proce_text: '等待上门自提',
            icon: 'icon-order-succ',
          },
          {
            status: 'default',
            track_type: '门店自提',
            track_datetime: this.orderData.confirm_time,
            proce_text: '期待您的好评',
            icon: 'icon-store',
          },
          {
            status: 'default',
            track_type: '完成',
            track_datetime: this.orderData.finish_time,
            proce_text: '',
            icon: 'icon-order-finish',
          },
        ],
        status: 0,
        statusText: '',
        arrowLeft: this.orderData.delivery_type === DELIVERY_COMMON ? ARROW_LEFT_INIT : ARROW_LEFT_INIT_STORE,
        orderStatus: {},
      };
    },

    computed: {
      arrowStyle() {
        return {
          left: `${this.arrowLeft}px`,
        };
      },
      currentStatusList() {
        let currStatus = 0;
        const statusLen = this.isCommonDelivery ? 4 : 3;
        const {
          status,
          pay_status: payStatus,
          ship_status: shipStatus,
        } = this.orderData;
        const isComment = this.orderData.is_comment === '1';

        // TODO 代码精简
        if (this.isCommonDelivery) {
          if (status === 'active' && (payStatus === '0' || payStatus === '3')) { // 待付款
            currStatus = 0;
            this.statusText = '等待买家付款';
          } else if ((status === 'active' || status === 'pending')
            && (payStatus === '1' || payStatus === '6' || payStatus === '2' || payStatus === '4')
            && shipStatus === '0') { // 待发货（已付款）
            currStatus = 1;
            this.statusText = '已付款';
            this.arrowLeft = ARROW_LEFT_INIT + PROCE_GAP;
          } else if ((status === 'active' || status === 'pending') && shipStatus === '1') { // 已发货
            currStatus = 2;
            this.statusText = '商家已发货';
            this.arrowLeft = ARROW_LEFT_INIT + (PROCE_GAP * currStatus);
          } else if ((status === 'finished' || status === 'finish') && !isComment) { // 已收货
            currStatus = 3;
            this.statusText = '已收货';
            this.arrowLeft = ARROW_LEFT_INIT + (PROCE_GAP * currStatus);
          } else if (isComment) { // 已完成
            // } else if (status === 'dead' || payStatus === '8' || payStatus === '7') { // 已关闭
            currStatus = 4;
            this.arrowLeft = ARROW_LEFT_INIT + ((PROCE_GAP * 3) + (PROCE_GAP / 2));
            this.statusText = '完成';
          }
        } else { // 门店自提
          if (status === 'active' && (payStatus === '0' || payStatus === '3')) { // eslint-disable-line
            currStatus = 0;
            this.statusText = '等待买家付款';
          } else if ((status === 'active' || status === 'pending')
            && (payStatus === '1' || payStatus === '6' || payStatus === '2' || payStatus === '4')
            && shipStatus === '0') { // 待发货（已付款）
            currStatus = 1;
            this.statusText = '已付款';
            this.arrowLeft = ARROW_LEFT_INIT_STORE + PROCE_GAP;
          } else if ((status === 'finished' || status === 'finish') && !isComment) { // 已收货
            currStatus = 2;
            this.statusText = '已收货';
            this.arrowLeft = ARROW_LEFT_INIT_STORE + (PROCE_GAP * currStatus);
          } else if (isComment) { // 已完成
            // } else if (status === 'dead' || payStatus === '8' || payStatus === '7') { // 已关闭
            currStatus = 3;
            this.arrowLeft = ARROW_LEFT_INIT_STORE + ((PROCE_GAP * 2) + (PROCE_GAP / 2));
            this.statusText = '完成';
          }
        }

        // 处理已关闭订单，状态为已关闭前的状态。已关闭订单，必然是已支付过的（即currStatus=1），
        // 且，如果是普通快递方式，会有两种情况：1. 已支付后全额退款；2. 已发货后全额退款；
        // 如果是自提，只有一种情况：已支付后全额退款
        if (this.orderStatus.isClosed) {
          this.statusText = '已关闭';
          currStatus = 1;
          this.arrowLeft = (this.isCommonDelivery ? ARROW_LEFT_INIT : ARROW_LEFT_INIT_STORE) + PROCE_GAP;

          if (this.isCommonDelivery && shipStatus === '1') {
            currStatus = 2;
            this.arrowLeft = ARROW_LEFT_INIT + (PROCE_GAP * currStatus);
          }
        }

        this.status = currStatus;

        return this[this.isCommonDelivery ? 'statusList' : 'storeStatusList'].map((item, index) => {
          if (currStatus === 0) return item;
          if (currStatus >= 1 && currStatus < statusLen) {
            if (index < currStatus) {
              const it = {
                ...item,
                status: 'done',
              };

              return it;
            } else if (index === currStatus) {
              return {
                ...item,
                status: 'pending',
              };
            }
          } else if (currStatus === statusLen) {
            return {
              ...item,
              status: 'finish',
            };
          }

          return item;
        });
      },
      isFinished() {
        if ((this.isCommonDelivery && this.status === 4) || (!this.isCommonDelivery && this.status === 3)) {
          return true;
        }
        return false;
      },
    },

    created() {
      this.orderStatus = this.getOrderStatus(this.orderData);
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .order-status-wrap {
    .order-status-box {
      margin-top: 20px;
      padding-top: 75px;
      height: 240px;
      border-top: 3px solid $g-highlight;
      background-color: white;
      text-align: center;

      .order-process {
        display: inline-block;

        .node {
          float: left;
          position: relative;
          top: -22px;
          width: 61px;

          $path: "../../assets/images/my/order/";

          &.pending,
          &.done {
            .icon {
              background-image: url("#{$path}double-circle-red.png");

              i {
                color: $g-highlight;
              }
            }
          }

          &.default {
            .icon {
              background-image: url("#{$path}double-circle.png");

              i {
                color: #b9b9b9;
              }
            }

            .track-time {
              color: #b9b9b9;
            }
          }

          &.finish {
            .icon {
              background-image: url("#{$path}double-circle-green.png");

              i {
                color: #4c8b03;
              }
            }
          }

          .icon {
            i {
              font-size: 25px;
              line-height: 61px;
            }
          }

          .holder {
            height: 100px;
          }

          ul {
            position: absolute;
            top: -20px;
            left: -95px;
            width: 250px;
            text-align: center;

            .track-time {
              .title {
                font-size: 14px;
              }
            }
          }
        }

        .proce {
          float: left;
          position: relative;
          width: 110px;
          height: 12px;
          margin-left: 39px;
          margin-right: 39px;
          background-repeat-x: no-repeat;

          $type-list: default pending done finish;
          @mixin proce-bg-img {
            @each $type in $type-list { // stylelint-disable-line
              &.#{$type} {
                background-image: url("../../assets/images/my/order/proce-#{$type}.png");
              }
            }
          }

          @include proce-bg-img;

          ul {
            position: absolute;
            top: -35px;
            left: -92px;
            width: 275px;
            text-align: center;

            .text {
              font-size: 14px;
              font-weight: bold;
              color: $g-highlight;
            }
          }
        }
      }
    }

    .order-extra-box {
      position: relative;
      width: 100%;
      height: 120px;
      border: 1px solid $g-highlight;
      background-color: #fffdfa;

      .extra-arrow {
        top: -19px;
        left: 200px;
        margin-bottom: 9px;
        border-bottom-color: $g-highlight !important;
        border-width: 0 18px 18px;

        &,
        &::after {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
        }

        &::after {
          content: " ";
          border-width: 18px;
          top: 1px;
          margin-left: -18px;
          border-top-width: 0;
          border-bottom-color: #fffdfa;
        }
      }

      > table {
        margin-top: 20px;
        width: 100%;

        td {
          padding-top: 5px;
          padding-bottom: 5px;
          text-align: center;
          font-size: 14px;
          color: #333333;

          &.order-no {
            width: 350px;
          }

          &.status {
            font-size: 24px;
            font-weight: bold;
            color: $g-highlight;

            &.finish {
              color: #4c8b03;
            }
          }

          &.pay {
            width: 365px;

            a {
              display: inline-block;
              min-width: 121px;
              height: 30px;
              line-height: 30px;
              border-radius: 2px;
              color: white;
              background-color: $g-highlight;
            }
          }

          &.cancel {
            font-size: 12px;
          }

          .remain-time {
            color: $g-highlight;
          }

          a {
            color: inherit;
          }
        }
      }
    }
  }

  .store-code-wrap {
    text-align: center;

    img {
      width: 150px;
      height: 150px;
      display: inline-block;
      background-color: #efefef;
    }

    p,
    img {
      margin: 10px;
    }
  }
</style>
