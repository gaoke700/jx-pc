<template>
  <div class="order-goods">
    <a name="order-goods"></a>
    <div class="goods-list">
      <table class="table-order">
        <thead>
        <tr>
          <td>商品</td>
          <td>商品编号</td>
          <td>价格</td>
          <td>商品数量</td>
          <td>操作</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="goods in orderData.items">
          <td>
            <div class="goods-item">
              <div class="pic">
                <a :href="`detail.html?goods_id=${goods.goods_id}`" target="_blank">
                  <img :src="goods.thumbnail_pic" :alt="goods.name">
                </a>
              </div>
              <div class="msg">
                <div class="name"><a :href="`detail.html?goods_id=${goods.goods_id}`" target="_blank">{{ goods.name
                  }}</a></div>
                <div class="extra">
                  <span class="c6">{{ goods.pdt_desc }}</span>
                </div>
              </div>
            </div>
          </td>
          <td>{{ goods.bn }}</td>
          <td>￥{{ goods.price }}</td>
          <td>{{ goods.nums }}</td>
          <!--refund_status 退款状态 0 正常, 1 待审核, 2 退款中, 3 退款完成-->
          <td class="operate">
            <!--退款信息为空或未支付显示-->
            <template v-if="goods.refund_info === ''">
              <!--收货之后可 立即评价-->
              <template v-if="orderStatus.isReceipt">
                <a
                  :href="`my-comment.html?order_id=${orderData.order_id}&site_id=${orderData.site_id}&member_id=${orderData.member_id}`"
                  v-if="goods.is_comment === '0'"
                  target="_blank">立即评价</a>
                <template v-else>-</template>
              </template>
              <!--评价之后可 查看评价-->
              <template v-else-if="orderStatus.isFinished">
                <a
                  :href="`my-comment-detail.html?order_id=${orderData.order_id}&site_id=${orderData.site_id}&member_id=${orderData.member_id}`"
                  v-if="goods.is_comment === '1'"
                  target="_blank" class="c6">查看评价</a>
                <template v-else>-</template>
              </template>
              <template v-else>-</template>
            </template>
            <template v-else>
              <a v-if="goods.refund_status === '0'" href="javascript:;"
                 @click="refundApply(goods, orderData.member_id)">
                {{ goods.refund_info }}</a>
              <a v-if="goods.refund_status === '1' || goods.refund_status === '2'"
                 :href="`my-refund-detail.html?aftersales_id=${goods.aftersalesId}&site_id=${goods.site_id}&member_id=${orderData.member_id}`"
                 target="_blank">
                {{ goods.refund_info }}</a>
              <span v-if="['0', '1', '2'].indexOf(goods.refund_status) === -1" style="color: #4c8b03;">
                <!--已退款-->
                <template v-if="goods.refund_status === '3'">
                  <a target="_blank"
                     :href="`my-refund-detail.html?aftersales_id=${goods.aftersalesId}&site_id=${orderData.site_id}&member_id=${orderData.member_id}`" style="color: #4c8b03;">{{ goods.refund_info }}</a>
                </template>
                <template v-else>{{ goods.refund_info }}</template>
              </span>
            </template>
          </td>
        </tr>
        </tbody>
      </table>

      <refund-dialog :showRefundDialog="showRefundDialog" ref="refundDialog"></refund-dialog>
    </div>
    <div class="goods-total">
      <ul>
        <li>
          <span class="label">商品总额：</span>
          <span class="text">￥{{ orderData.goods_amount }}</span>
        </li>
        <li>
          <span class="label">运费：</span>
          <span class="text">￥{{ orderData.shipping.cost || '0.00'}}</span>
        </li>
        <li v-if="orderData.mjInfo">
          <span class="label">满减送：</span>
          <span class="text">-￥{{ orderData.mjInfo.minus_mount || '0.00' }}</span>
        </li>
        <li v-if="orderData.coupon_info">
          <span class="label">优惠券：</span>
          <span class="text">-￥{{ orderData.coupon_info.price || '0.00' }}</span>
        </li>
        <li>
          <span class="label">积分抵扣：</span>
          <span class="text">-￥{{ orderData.score_discount || '0.00' }}</span>
        </li>
        <li class="total-amount">
          <span class="label">应付总额：</span>
          <span class="text">￥{{ orderData.amount.final }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { scrollAnchor } from 'utils/queryStr';
  import RefundDialog from './RefundDialog';
  import CommonMixin from './common';

  export default {
    mixins: [CommonMixin],

    components: {
      RefundDialog,
    },

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
        showRefundDialog: false,
        orderStatus: {},
      };
    },

    methods: {
      refundApply({ item_id, site_id, order_id }, member_id) { // eslint-disable-line
        this.$refs.refundDialog.refundApply({ item_id, site_id, order_id, member_id });
      },
    },

    created() {
      this.orderStatus = this.getOrderStatus(this.orderData);
    },

    mounted() {
      scrollAnchor('order-goods');
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .order-goods {
    margin-top: 20px;
    min-height: 330px;
    background-color: white;

    .table-order {
      width: 100%;

      thead td {
        height: 40px;
        font-size: 13px;
        color: #666666;
        background-color: #fcfcfc;
        text-align: center;
        border-bottom: 1px solid #efefef;

        &:first-child {
          width: 560px;
        }

        &:not(:first-child) {
          width: 160px;
        }
      }

      tbody {
        .goods-item {
          float: left;
          position: relative;
          width: 360px;
          margin-right: 53px;

          .pic {
            float: left;
            width: 60px;
            height: 60px;
            background-color: #efefef;

            img {
              width: 60px;
              height: 60px;
            }
          }

          .msg {
            float: left;
            width: 260px;
            margin-left: 20px;

            .name {
              @include multi-line-ellipsis(1.5em, 2);
            }

            a {
              color: inherit;

              &:hover {
                color: $g-highlight;
              }
            }

            .extra {
              position: absolute;
              bottom: 0;
            }
          }
        }

        td {
          padding: 20px;
          text-align: center;
          vertical-align: top;
          border-bottom: 1px solid #efefef;

          &:first-child {
            color: black;
          }

          &.operate {
            color: #666666;

            .cred {
              color: $g-highlight !important;
            }
          }

          a {
            color: inherit;

            &:hover {
              color: $g-highlight;
            }
          }
        }
      }
    }

    .goods-total {
      padding: 20px;

      @include clearfix();

      ul {
        float: right;

        li {
          display: block;
          height: 22px;
          line-height: 22px;

          .label {
            float: left;
            width: 500px;
            text-align: right;
          }

          .text {
            float: left;
            width: 130px;
            text-align: right;
          }

          &.total-amount {
            margin-top: 10px;
            color: $g-highlight;

            .text {
              font-size: 20px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>
