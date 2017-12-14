<template>
  <div class="page-pay">
    <layout-all>
      <div slot="site-header"></div>
      <div slot="shop-header"></div>
      <div slot="menu-bar"></div>
      <div slot="page-content">
        <g-jx-logo :isShowLine="true">
          <div slot="left" >{{is_payed? '支付成功':'支付失败'}}</div>
          <div slot="right" class="step-wrapper">
            <steps :space="150" :active="is_payed? 4:3" align-center finish-status="success" process-status="process">
              <step title="我的购物车"></step>
              <step title="填写核对订单信息"></step>
              <step title="成功提交订单"></step>
              <step :title="is_payed? '支付成功':'支付失败'" :status="is_payed? 'success':'process' "></step>
            </steps>
          </div>
        </g-jx-logo>
        <div class="g-line"></div>
        <div
          :style="{borderBottom:productRecommend.length>4?'1px solid #dddddd':''}"
          class="container pay-wrap">
          <div class="pay-icon">
            <span class="iconfont " :class="is_payed? 'icon-success-thick':'icon-failure' "></span>
          </div>
          <div class="pay-order-status">订单{{is_payed? '支付成功':'支付失败'}}！</div>
          <div class="pay-order-number">
            <span class="color-grey">订单号：</span>
            <span>{{orderId}}</span>
          </div>
          <div class="pay-order-order-money">
            <span class="color-grey">订单金额：</span>
            <span>{{orderMoney}}</span>
            <span>元</span>{{productCheckout.order_id}}
          </div>
          <div class="pay-order-link mt15">
            <a :href="'pay.html?order_id='+orderId+'&pay_type=2'" class="pay-order-link-item" v-if="!is_payed">继续支付</a>
            <a :href="`my-order-detail.html?order_id=${orderId}&site_id=${productCheckout.site_id}&member_id=${productCheckout.member_id}`" class="pay-order-link-item order-detail pr " :class="{ 'pay-order-link-item-last' : !is_payed }">
              查看订单详情
              <!--<div class="tc order-code p10 w140 none pa">-->
                <!--<div class="triangle pa"></div>-->
                <!--<img class="w100 h100" :src="orderDetailsCode" alt="订单详情二维码">-->
                <!--<div class="lh200 color-grey f12">扫描二维码，查看详情</div>-->
              <!--</div>-->
            </a>
            <a href="index.html" class="pay-order-link-item pay-order-link-item-last">继续购物</a>
          </div>
          <div class="pay-qr-code tc" v-if="store_code">
            <div class="f14 color-grey pb10">您的提货码为：{{store_code}}</div>
            <img :src="pickUpCode" class="pay-qr-code-img">
            <div class="pay-qr-code-text color-grey">您可手机拍照保存提货二维码<br />并在门店提货时提供给店员</div>
          </div>
        </div>
        <g-product-recommend :recType="3" @ajaxover="ajaxOver"></g-product-recommend>
      </div>
    </layout-all>
  </div>
</template>

<script>
  import { Steps, Step } from 'components/step';
  import utils from 'utils/utils';
  import LayoutAll from '../layout/LayoutAll';
  import GJxLogo from '../common/GJxLogo';
  import GProductRecommend from '../common/GProductRecommend';
  import pay from '../../api/pay';

  export default {
    data() {
      return {
        orderDetailsCode: '',
        orderId: '1708281431277839',
        orderMoney: 99999999999,
        pickUpCode: '',
        productRecommend: [],
        is_payed: true,
        store_code: '',
        productCheckout: [],
      };
    },
    created() {
      if (utils.getUrlObj().order_id) {
        this.orderId = utils.getUrlObj().order_id;
      }
      pay.getStatus({
        order_id: this.orderId,
        is_platform: false,
      }).then((res) => {
        const data = res.data || {};
        this.productCheckout = data;
        this.orderDetailsCode = data.order_detail;
        this.orderMoney = data.total_amount;
        this.store_code = data.store_code;
        this.pickUpCode = data.store_code_url;
        if (data.is_payed) {
          this.is_payed = true;
        } else {
          this.is_payed = false;
        }
      });
    },
    methods: {
      ajaxOver(data) {
        this.productRecommend = data;
      },
    },
    components: {
      LayoutAll,
      GProductRecommend,
      GJxLogo,
      Steps,
      Step,
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/theme";

  .page-pay {
    .pay-wrap {
      position: relative;
      padding: 20px 0 60px;
      margin-bottom: 20px;

      .color-grey {
        color: #888888;
      }

      .pay-icon {
        width: 55px;
        height: 55px;
        font-size: 32px;
        font-weight: bold;
        line-height: 55px;
        color: #ffffff;
        text-align: center;
        background: #fa7d50;
        border-radius: 1000px;
      }

      .pay-order-status {
        height: 60px;
        font-size: 24px;
        font-weight: bold;
        line-height: 60px;
        color: #fa7d50;
      }

      .pay-order-number {
        font-size: 14px;
        line-height: 40px;
        color: #666666;
      }

      .pay-order-order-money {
        font-size: 14px;
        line-height: 40px;
        color: #666666;
      }

      .pay-order-link {
        font-size: 0;

        .order-detail {
          z-index: 9;

          .order-code {
            top: 26px;
            left: 0;
            background: white;
            box-shadow: 0 0 20px #dddddd;

            .triangle {
              width: 0;
              height: 0;
              border-left: 14px solid transparent;
              border-right: 14px solid transparent;
              border-bottom: 14px solid white;
              position: absolute;
              top: -8px;
              left: 30px;
            }
          }

          /*
          &:hover {
            .order-code {
              display: block;
            }
          }
          */
        }

        .pay-order-link-item {
          display: inline-block;
          font-size: 14px;
          line-height: 1;
          color: #5b95ce;
          vertical-align: top;
          cursor: pointer;

          &.pay-order-link-item-last {
            padding-left: 15px;
            margin-left: 15px;
            border-left: 1px solid #dddddd;
          }
        }
      }

      .pay-qr-code {
        position: absolute;
        top: 56px;
        right: 46px;

        .pay-qr-code-img {
          box-sizing: border-box;
          width: 150px;
          height: 150px;
          padding: 8px;
          border: 1px solid #dddddd;
          box-shadow: 0 0 10px #dddddd;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .pay-qr-code-text {
          padding-top: 10px;
          font-size: 14px;
          text-align: center;
        }
      }
    }

    .login-wrap {
      position: relative;
      height: 600px;
      background: #ff644e;
    }

    .login-main {
      position: absolute;
      top: 50%;
      right: 10%;
      width: 400px;
      margin-top: -215px;
      background: #ffffff;

      .login-header {
        height: 120px;
        font-size: 24px;
        font-weight: bold;
        line-height: 120px;
        color: #ff644e;
        text-align: center;
      }

      .login-body {
        @include clearfix();

        .login-body-left {
          box-sizing: border-box;
          float: left;
          width: 160px;
          height: 160px;
          padding: 10px;
          margin-right: 10px;
          margin-left: 30px;
          border: 1px solid #e2e2e2;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .login-body-right {
          box-sizing: border-box;
          float: left;
          height: 160px;

          img {
            height: 100%;
          }
        }
      }

      .login-hint {
        height: 84px;
        font-size: 14px;
        line-height: 84px;
        color: #333333;
        text-align: center;
      }

      .login-footer {
        height: 66px;
        background: #f8f8f8;
      }
    }
  }
</style>
