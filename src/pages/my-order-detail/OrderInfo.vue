<template>
  <div class="order-info-box">
    <div class="dl">
      <div class="dt">收货人信息</div>
      <div class="dd">
        <div class="item">
          <span class="label">收货人：</span>
          <div class="text">{{ orderData.receiver.name }}</div>
        </div>
        <div class="item">
          <span class="label">地址：</span>
          <div class="text">{{ orderData.receiver.addr }}</div>
        </div>
        <div class="item">
          <span class="label">手机号：</span>
          <div class="text">{{ orderData.receiver.mobile }}</div>
        </div>
      </div>
    </div>
    <div class="dl">
      <div class="dt">配送信息</div>
      <div class="dd">
        <div class="item">
          <div class="item">
            <span class="label">配送方式：</span>
            <div class="text">{{ DELIVERY_TYPE[orderData.delivery_type] }}</div>
          </div>
          <div class="item">
            <span class="label">运费：</span>
            <div class="text">￥{{ orderData.cost_payment || '0.00' }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="dl">
      <div class="dt">付款信息</div>
      <div class="dd">
        <div class="item">
          <div class="item">
            <span class="label">支付方式：</span>
            <div class="text">{{ PAYMENT_MAP[orderData.payment] }}</div>
          </div>
          <div class="item">
            <span class="label">付款时间：</span>
            <div class="text">{{ orderData.pay_time | dateFormat('YYYY-MM-DD HH:mm:ss') || '-' }}</div>
          </div>
          <div class="item">
            <span class="label">商品总额：</span>
            <div class="text">￥{{ orderData.goods_amount || '0.00'}}</div>
          </div>
          <div class="item">
            <span class="label">应支付金额：</span>
            <div class="text">￥{{ orderData.amount.final || '0.00'}}</div>
          </div>
          <div class="item">
            <span class="label">运费金额：</span>
            <div class="text">￥{{ orderData.shipping.cost || '0.00' }}</div>
          </div>
          <div class="item" v-if="orderData.mjInfo">
            <span class="label">满减送：</span>
            <div class="text">￥{{ orderData.mjInfo.minus_mount || '0.00' }}</div>
          </div>
          <div class="item" v-if="orderData.coupon_info">
            <span class="label">优惠券：</span>
            <div class="text">￥{{ orderData.coupon_info.price || '0.00' }}</div>
          </div>
          <div class="item">
            <span class="label">积分使用：</span>
            <div class="text">{{ orderData.score_u || '0' }}</div>
          </div>
          <div class="item">
            <span class="label">给商家留言：</span>
            <div class="text">{{ orderData.memo || '无' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { PAYMENT_MAP, DELIVERY_TYPE } from '@/common/consts';

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
        PAYMENT_MAP,
        DELIVERY_TYPE,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .order-info-box {
    height: 290px;
    border-top: 4px solid #f2f2f2;
    margin-top: 20px;
    background-color: white;

    .dl {
      float: left;
      width: percentage(1/3);
      height: 100%;
      padding: 20px;

      &:not(:last-child) {
        border-right: 1px solid #dddddd;
      }

      .dt {
        font-size: 14px;
        color: #333333;
      }

      .dd {
        margin-top: 10px;
        max-height: 220px;
        overflow: auto;
        color: #666666;

        .item {
          line-height: 24px;
          display: block;

          @include clearfix();

          .label {
            float: left;
            width: 84px;
          }

          .text {
            float: left;
            width: 240px;
            max-height: 72px;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
