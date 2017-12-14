<template>
  <div class="delivery-track g-clearfix">
    <a name="order-delivery"></a>
    <div class="track-left">
      <div class="p-item g-clearfix" :class="{ multi: orderData.items.length > 1 }">
        <div class="p-img" :style="{ 'background-image': `url(${orderData.items[0].thumbnail_pic})` }">
          <!--<a href="#">
            <img :src="orderData.items[0].thumbnail_pic" :alt="orderData.items[0].name"></a>-->
        </div>
        <div class="p-info">
          <ul>
            <li>送货方式：{{ DELIVERY_TYPE[orderData.delivery_type] }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="track-right">
      <div class="track-timeline-wrap">
        <el-scrollbar class="ui-timeline" tag="ul" noresize wrap-style="max-height: inherit;padding-top: 5px;">
          <li class="ui-timeline-item" v-for="(item, index) in deliveryData">
            <div class="ui-timeline-item-tail"></div>
            <div class="ui-timeline-item-head"
                 :class="[index === 0 ? 'ui-timeline-item-head-red' : 'ui-timeline-item-head-gray']"></div>
            <div class="ui-timeline-item-content">
              <span class="date">
                <template v-if="item.date">{{ item.date }}/{{ item.date | dateFormat('dd') }}</template>
              </span>
              <span class="time">{{ item.time }}</span>
              <span class="text">{{ item.AcceptStation }}</span>
            </div>
          </li>
          <li v-if="deliveryData.length === 0" class="no-deliver">{{ deliveryMsg }}</li>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
  import memberOrder from 'api/member-order';
  import { DELIVERY_TYPE, DELIVERY_COMMON } from '@/common/consts';
  import { scrollAnchor } from 'utils/queryStr';

  export default {
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
        DELIVERY_TYPE,
        deliveryData: [],
        isCommonDelivery: this.orderData.delivery_type === DELIVERY_COMMON,
      };
    },

    computed: {
      deliveryMsg() {
        const {
          pay_status: payStatus,
          ship_status: shipStatus,
          status,
        } = this.orderData;
        let msg = '';

        if (this.isCommonDelivery) {
          if (status === 'active' && (payStatus === '0' || payStatus === '3')) { // 待付款
            msg = '您的订单已创建，请尽快付款';
          } else if ((status === 'active' || status === 'pending')
            && (payStatus === '1' || payStatus === '6' || payStatus === '2' || payStatus === '4') && shipStatus === '0') { // 待发货（已付款）
            msg = '您的订单尚未发货';
          } else if (!this.deliveryData.length) { // 已发货且无物流信息
            msg = '您的订单物流信息获取异常，请联系商家';
          }
        } else { // 门店自提
          if (status === 'active' && (payStatus === '0' || payStatus === '3')) { // eslint-disable-line
            msg = '您的自提订单已创建，请尽快付款';
          } else if ((status === 'active' || status === 'pending')
            && (payStatus === '1' || payStatus === '6' || payStatus === '2' || payStatus === '4')
            && shipStatus === '0') { // 待发货（已付款）
            msg = '您已付款，请上门自提';
          } else if ((status === 'finished' || status === 'finish')) { // 已收货
            msg = '您的订单自提完成';
          }
        }

        return msg;
      },
    },

    methods: {
      getDelivery(params) {
        memberOrder.getDelivery(params).then((data) => {
          this.deliveryData = this.formatData(data);
        });
      },
      formatData(data) {
        if (!data.length) return [];

        let result = data;
        const dateMap = {};

        result = (result || []).map((item) => {
          const [date, time] = (item.AcceptTime || '').split(' ');
          const o = {
            date: dateMap[date] ? '' : date, // 移除重复的日期
            time,
          };

          if (!dateMap[date]) {
            dateMap[date] = true;
          }

          return {
            ...item,
            ...o,
          };
        });

        return result;
      },
    },

    created() {
      const {
        order_id,
        site_id,
        status,
        ship_status: shipStatus,
        member_id,
      } = this.orderData;

      if (this.isCommonDelivery) {
        const isDelivery = (status === 'active' || status === 'pending' || status === 'finish') && shipStatus === '1'; // 已发货
        if (!isDelivery) return;
      } else {
        return;
      }

      this.getDelivery({
        order_id,
        site_id,
        member_id,
      });
    },

    mounted() {
      scrollAnchor('order-delivery');
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";

  .delivery-track {
    margin-top: 20px;
    background-color: white;
    font-size: 0;

    .track-left,
    .track-right {
      float: left;
      display: inline-block;
      height: 242px;
      padding: 15px 10px 15px 20px;
      font-size: 12px;
    }

    .track-left {
      position: relative;
      width: 400px;
      border-right: 1px solid #dddddd;

      .p-item {
        display: block;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        margin-bottom: 30px;
        // background-position: left top;

        &.multi {
          background: url("../../assets/images/my/order/pimg-bg.png") 0 top no-repeat;
        }

        .p-img {
          float: left;
          margin: 4px 0 0;
          width: 102px;
          height: 100px;
          line-height: 100px;
          text-align: center;
          border: 1px solid #efefef;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          img {
            width: 100px;
            border: 0;
            vertical-align: middle;
          }
        }

        .p-info {
          float: left;
          width: 170px;
          margin: 40px 0 0 40px;
          line-height: 25px;
          color: #333333;
          word-break: break-all;
        }
      }
    }

    .track-right {
      width: 800px;

      .track-timeline-wrap {
        height: 100%;
        padding-top: 5px;
        // overflow-y: scroll;

        .no-deliver {
          height: 200px;
          line-height: 200px;
          text-align: center;
          color: #888888;
        }

        .ui-timeline {
          max-height: 212px;

          .el-scrollbar__view {
            padding-top: 5px;
          }
        }

        .ui-timeline-item-content {
          color: #888888;

          &:first-child {
            .text {
              font-weight: bold;
            }
          }

          .date,
          .time,
          .text {
            vertical-align: top;
          }

          .date {
            display: inline-block;
            width: 118px;
          }

          .time {
            display: inline-block;
            width: 66px;
          }

          .text {
            display: inline-block;
            max-width: 540px;
          }
        }

        .ui-timeline-item:first-child {
          .ui-timeline-item-content .text {
            font-weight: bold;
            color: #333333;
          }
        }

        // 重置默认样式
        .ui-timeline-item {
          padding: 0;

          .ui-timeline-item-tail {
            left: 7px;
          }

          .ui-timeline-item-head {
            left: 5px;

            &::before {
              border: 2px solid white;
              content: "";
              width: 100%;
              display: block;
              position: absolute;
              height: auto;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              border-radius: 100%;
              transform-origin: center center;
              transform: scale(2.5);
              box-sizing: border-box;
            }
          }

          .ui-timeline-item-head-red {
            &::after {
              content: "";
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              width: 100%;
              height: auto;
              box-shadow: 0 0 1px 1px $g-highlight;
              border-radius: 100%;
              transform-origin: center center;
              // opacity: 0.2;
              transform: scale(1.3);
              box-sizing: border-box;
            }
          }
        }
      }
    }
  }
</style>
