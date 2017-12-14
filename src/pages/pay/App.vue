<template>
  <div class="page-payment">
    <layout-all>
      <div slot="site-header"></div>
      <div slot="shop-header"></div>
      <div slot="menu-bar"></div>
      <div slot="page-content">
        <g-jx-logo :isShowLine="true">
          <div slot="left">订单支付</div>
          <div slot="right" class="step-wrapper">
            <steps :space="150" :active="active" align-center finish-status="success">
              <step title="我的购物车"></step>
              <step title="填写核对订单信息"></step>
              <step title="成功提交订单"></step>
              <step title="成功支付"></step>
            </steps>
          </div>
        </g-jx-logo>
        <div class="g-line"></div>
        <div class="page-payment-wrapper">
          <div class="page-payment-succ">
            <div class="page-payment-succ-text fl">订单提交成功，请尽快付款，避免订单自动取消！</div>
            <div class="page-payment-succ-ri fr">
              应付总计：<span>{{amount}}</span>元
            </div>
          </div>
          <div class="page-payment-order">订单号：{{orderId}}</div>
          <div class="page-payment-way">
            <div class="page-payment-way-text wechat fl" :class="{'on': payType == 2}" @click="wechatPayment()">
              微信支付
            </div>
            <div class="divide-line fl"></div>
            <div class="page-payment-way-text alipay fl" :class="{'on': payType == 1}" @click="alipayPayment()">
              支付宝支付
            </div>
          </div>
          <div class="page-payment-box">
            <div class="page-payment-box-left fl">
              <div class="qrcode-text">距二维码过期还剩<span>{{setWxpayTime}}</span>秒，过期后请刷新页面重新获取
              </div>
              <div class="qrcode-img">
                <img :src="qrcodeImg"/>
              </div>
              <div class="qrcode-info">
                <div class="iqrcode-info-icon fl">
                  <img src="../../assets/images/pay/pay-sao.png"/>
                </div>
                <div class="qrcode-info-text fr">
                  <p>请使用<span class="js-sao-alipay">{{alipayText}}</span>扫一扫</p>
                  <p>扫描二维码支付</p>
                </div>
              </div>
            </div>
            <div class="page-payment-box-ri fr" :class="alipayRiImg"></div>
          </div>
        </div>
      </div>
    </layout-all>
    <!--<dialog-prompt :isShow="true" text="二维码已过期，请重新刷新页面！"></dialog-prompt>-->
    <div class="page-payment-mask" :class="{'on': dialogShow == 1}">
      <div class="g-dialog-wrap">
        <div class="g-dialog-content">
          <div class="g-dialog-content-default">{{dialogText}}</div>
        </div>
        <div class="g-dialog-btn">
          <div class="g-btn-default g-btn-cancel" @click="payBack()">刷新当前页</div>
          <div class="g-btn-default g-btn-ok" @click="payForward()">查看支付结果</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getQueryParams } from 'utils/queryStr';
  import { Steps, Step } from 'components/step';
  import GJxLogo from '../common/GJxLogo';
  import LayoutAll from '../layout/LayoutAll';
  import payment from '../../api/payment';
  import pay from '../../api/pay';
//  import DialogPrompt from '../../components/dialog/prompt';

  export default {
    components: {
      LayoutAll,
      GJxLogo,
      Steps,
      Step,
    },

    data() {
      return {
        active: 3,
        orderId: '',
        amount: '0.00',
        payType: 2,
        qrcodeImg: '',
        alipayText: '微信',
        alipayRiImg: '',
        setWxpayTime: 180,
        wxpayTimer: null,
        wxpayStor: '',
        alipayStor: '',
        wxchargeId: '',
        alichargeId: '',
        wxTeegonTimer: null,
        aliTeegonTimer: null,
        TimeOver: false,
        dialogText: '',
        dialogShow: 0,
      };
    },
    created() {
      this.pageUrl();
      this.checkPayStatus();
    },
    methods: {
      pageUrl() {
        const paramsObj = getQueryParams();
        if (paramsObj) {
          this.orderId = paramsObj.order_id;
          this.payType = paramsObj.pay_type;
        }
      },
      checkPayStatus() {
        pay.getStatus({
          order_id: this.orderId,
          is_platform: false,
        }).then((res) => {
          const data = res.data || {};
          if (data.is_payed) {
            this.paySucc();
            return;
          }
          if (this.payType === 2 || this.payType === '2') {
            this.wechatPayment();
          } else {
            this.alipayPayment();
          }
        });
      },
      wechatPayment() {
        if (this.wxpayStor === '') {
          payment.payCode({
            order_id: this.orderId,
            channel: 'wxpay',
          }).then((wxresult) => {
            this.amount = wxresult.amount;
            this.wxpayStor = wxresult.url;
            this.wxchargeId = wxresult.charge_id;
            this.wxExecute();
          });
        } else {
          this.wxExecute();
        }
      },
      alipayPayment() {
        if (this.alipayStor === '') {
          payment.payCode({
            order_id: this.orderId,
            channel: 'alipay',
          }).then((aliresult) => {
            this.amount = aliresult.amount;
            this.alipayStor = aliresult.url;
            this.alichargeId = aliresult.charge_id;
            this.alipayExecute();
          });
        } else {
          this.alipayExecute();
        }
      },
      wxExecute() {
        this.qrcodeImg = this.wxpayStor;
        this.payType = 2;
        this.alipayText = '微信';
        this.alipayRiImg = '';
        this.timeOut();
        this.wxpayTeegon();
      },
      alipayExecute() {
        this.qrcodeImg = this.alipayStor;
        this.payType = 1;
        this.alipayText = '支付宝';
        this.alipayRiImg = 'js-check-aplipay';
        this.timeOut();
        this.alipayTeegon();
      },
      timeOut() {
        clearInterval(this.wxpayTimer);
        this.wxpayTimer = setInterval(() => {
          this.setWxpayTime = this.setWxpayTime - 1;
          if (this.setWxpayTime === -1) {
            this.setWxpayTime = 0;
            clearInterval(this.wxpayTimer);
            this.TimeOver = true;
            this.dialogShow = 1;
            this.dialogText = '二维码已过期，请重新刷新页面！';
            this.clearAllTimer();
          }
        }, 1000);
      },
      wxpayTeegon() {
        let paid = '';
        if (this.TimeOver === false || this.TimeOver === 'false') {
          clearInterval(this.wxTeegonTimer);
          this.wxTeegonTimer = setInterval(() => {
            payment.payTeegon({
              charge_id: this.wxchargeId,
            }).then((data) => {
              paid = data.paid;
              if (paid === true) {
                this.paySucc();
                this.clearAllTimer();
              }
            });
          }, 1000);
        } else {
          this.clearAllTimer();
        }
      },
      alipayTeegon() {
        let paid = '';
        if (this.TimeOver === false || this.TimeOver === 'false') {
          clearInterval(this.aliTeegonTimer);
          this.aliTeegonTimer = setInterval(() => {
            payment.payTeegon({
              charge_id: this.alichargeId,
            }).then((data) => {
              paid = data.paid;
              if (paid === true) {
                this.paySucc();
                this.clearAllTimer();
              }
            });
          }, 1000);
        } else {
          this.clearAllTimer();
        }
      },
      paySucc() {
        this.dialogShow = 1;
        this.dialogText = '支付成功';
        this.active = 4;
      },
      clearAllTimer() {
        clearInterval(this.wxTeegonTimer);
        clearInterval(this.aliTeegonTimer);
        clearInterval(this.wxpayTimer);
      },
      payForward() {
        window.location.href = `pay-over.html?order_id=${this.orderId}`;
      },
      payBack() {
        window.location.reload();
      },
    },
  };
</script>

<style lang="scss">
  @import "../../styles/theme";
  @import "../../styles/variables";

  .page-payment {
    .step-wrapper {
      .ui-step:last-child {
        width: 50px !important;
      }

      .ui-step__title {
        font-size: 12px;
      }
    }

    .page-payment-wrapper {
      width: 1200px;
      margin: 10px auto 50px;

      .page-payment-succ {
        overflow: hidden;
        font-size: 14px;
        line-height: 30px;

        .page-payment-succ-text {
          width: 500px;
          font-weight: bold;
          color: #666666;
        }

        .page-payment-succ-ri {
          width: 200px;
          margin-left: 20px;
          color: #888888;

          span {
            font-size: 20px;
            color: $g-highlight;
          }
        }
      }

      .page-payment-order {
        font-size: 12px;
        line-height: 20px;
        color: #888888;
      }

      .page-payment-way {
        height: 16px;
        margin: 30px 0 20px 30px;
        font-size: 16px;
        line-height: 16px;
        color: #333333;

        .page-payment-way-text {
          cursor: pointer;
          &.on {
            color: $g-highlight;
          }
        }

        .divide-line {
          height: 100%;
          margin: 0 10px;
          color: #888888;
          border-left: 1px solid #dddddd;
        }
      }

      .page-payment-box {
        width: 830px;
        height: 440px;
        padding: 50px 116px 50px 252px;
        border: 1px solid #e3e3e3;

        .page-payment-box-left {
          width: 328px;
          height: 440px;

          .qrcode-text {
            width: 300px;
            font-size: 12px;
            color: #888888;
            text-align: center;

            span {
              margin: 0 2px;
              color: $g-highlight;
            }
          }

          .qrcode-img {
            width: 258px;
            height: 258px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #e3e3e3;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .qrcode-info {
            width: 206px;
            height: 52px;
            padding: 10px 47px;
            overflow: hidden;
            background: $g-highlight;

            .iqrcode-info-icon {
              width: 50px;
              height: 50px;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .qrcode-info-text {
              width: 140px;
              font-size: 14px;
              color: #ffffff;

              p {
                line-height: 25px;
              }
            }
          }
        }

        .page-payment-box-ri {
          width: 460px;
          height: 472px;
          background: url("../../assets/images/pay/pay-wechat.png") center center no-repeat;

          &.js-check-aplipay {
            background: url("../../assets/images/pay/pay-alipay.png") center center no-repeat;
          }
        }
      }
    }

    .page-payment-mask {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 275;
      background-color: rgba(0, 0, 0, 0.4);

      .g-dialog-wrap {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 300px;
        height: 200px;
        font-size: 14px;
        color: #3a3b40;
        background: #ffffff;
        transform: translate(-50%, -50%);

        .g-dialog-content {
          font-size: 15px;
          font-weight: 500;
          color: #333333;
          .g-dialog-content-default {
            padding-top: 65px;
            padding-bottom: 50px;
            text-align: center;
          }
        }
        .g-dialog-btn {
          display: -webkit-box;
          -webkit-box-pack: center;
          -webkit-box-align: center;
          padding-bottom: 24px;

          .g-btn-default {
            font-size: 12px;
            min-width: 68px;
            padding-left: 10px;
            padding-right: 10px;
            text-align: center;
            line-height: 28px;
            border: 1px solid #c0c8cf;
            border-radius: 5px;
            background: #ffffff;
            color: #3a3b40;
            cursor: pointer;
          }
          .g-btn-ok {
            margin-left: 15px;
            background: $g-highlight;
            border-color: $g-highlight;
            color: white;
          }
        }
      }
      &.on {
        display: block;
      }
    }
  }
</style>
