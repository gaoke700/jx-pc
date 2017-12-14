<template>
  <layout-all class="my-order-canceled-wrap" :current-url="'my-order-canceled.html'">
    <div class="content-body">
      <div class="order-wrap">
        <div class="table-wrap">
          <h3 class="title">已取消订单</h3>
          <table class="order-table">
            <thead>
              <tr>
                <td style="width: 230px;">商品编号</td>
                <td style="width: 300px;">商品名称</td>
                <td style="width: 150px;">商品价格</td>
                <td style="width: 150px;">商品数量</td>
                <td style="">操作</td>
              </tr>
            </thead>

            <tbody>
              <tr style="font-weight: bold;" v-for="item in orderData.items">
                <td>{{ item.order_id }}</td>
                <td>{{ item.name }}</td>
                <td class="cred">￥{{ item.price }}</td>
                <td>{{ item.nums }}</td>
                <td><a href="javascript:;" class="ui-button btn-s-primary" @click="addCart(item)">放回购物车</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-wrap">
          <h3 class="title">订单信息</h3>
          <table class="order-table simple-table">
            <tbody>
              <tr>
                <td style="width: 200px;">订单编号</td>
                <td>{{ orderData.order_id }}</td>
              </tr>
              <tr>
                <td>配送方式</td>
                <td>{{ DELIVERY_TYPE[orderData.delivery_type] }}</td>
              </tr>
              <tr>
                <td>下单时间</td>
                <td>{{ orderData.createtime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</td>
              </tr>
              <tr>
                <td>取消时间</td>
                <td>{{ orderData.cancel_time | dateFormat('YYYY-MM-DD HH:mm:ss') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-wrap">
          <h3 class="title">收货人信息</h3>
          <table class="order-table simple-table" v-if="orderData && orderData.receiver">
            <tbody>
              <tr>
                <td style="width: 200px;">收货人姓名</td>
                <td>{{ orderData.receiver.name }}</td>
              </tr>
              <tr>
                <td>地址</td>
                <td>{{ orderData.receiver.addr }}</td>
              </tr>
              <tr>
                <td>手机号码</td>
                <td>
                  <span v-if="orderData.receiver.mobile">{{ orderData.receiver.mobile }}</span>
                  <!--<span class="ml20" v-if="orderData.receiver.tel">座机 {{ orderData.receiver.tel }}</span>-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-wrap">
          <h3 class="title">买家留言</h3>
          <p class="memo">{{ orderData.memo || '无' }}</p>
        </div>

        <div class="table-wrap">
          <h3 class="title">结算信息</h3>
          <p class="memo"></p>
          <table class="order-table simple-table" v-if="orderData.amount">
            <tbody>
              <tr>
                <td style="width: 200px;">商品金额</td>
                <td>￥{{ orderData.goods_amount }} + 运费：￥{{ orderData.shipping.cost || '0.00' }} -
                  满减：￥{{ orderData.mjInfo && orderData.mjInfo.minus_mount || '0.00' }}
                  - 优惠券：￥{{ orderData.pmt_amount || '0.00' }}
                  - 积分抵扣：￥{{ orderData.score_discount || '0.00' }}
                  = 订单总金额：<b class="cred">￥{{ orderData.amount.final }}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import { mapActions } from 'vuex';
  import memberOrder from 'api/member-order';
  import { getQueryParams } from 'utils/queryStr';
  import { DELIVERY_TYPE } from '@/common/consts';
  import ApiCarts from 'api/carts';
  import LayoutAll from '../my-layout/LayoutAll';

  export default {
    components: {
      LayoutAll,
    },

    data() {
      return {
        DELIVERY_TYPE,
        orderData: {},
      };
    },

    methods: {
      getDetail(params) {
        memberOrder.getDetail(params).then((data) => {
          this.orderData = data;
        });
      },
      addCart(goods) {
        ApiCarts.add({
          data: {
            site_id: goods.site_id,
            carts: [
              { product_id: goods.product_id, product_num: goods.nums },
            ],
          },
        }).then(() => {
          this.$message('已将商品放回购物车');
          this.getCartsList();
        });
      },
      ...mapActions(['getCartsList']),
    },

    created() {
      const { order_id, site_id, member_id } = getQueryParams();
      if (!order_id || !site_id || !member_id) return; // eslint-disable-line

      this.getDetail({ order_id, site_id, member_id });
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .my-order-canceled-wrap {
    &,
    * {
      box-sizing: border-box;
    }

    .content-body {
      .order-wrap {
        .table-wrap {
          margin-bottom: 20px;
          padding: 20px;
          background-color: white;

          .title {
            font-size: 14px;
            margin-bottom: 20px;
            font-weight: bold;
          }
        }
      }
    }
  }

  .order-table {
    width: 100%;

    &.simple-table {
      tr {
        border: none;

        td {
          padding: 10px 30px;
          border: 1px solid #efefef;

          &:nth-child(2) {
            text-align: left;
          }
        }
      }
    }

    thead {
      tr {
        background-color: #f7f7f7;

        td {
          height: 40px;
          font-size: 13px;
          text-align: center;
          color: #4a4a4a;
        }
      }
    }

    tbody {
      tr {
        border: 1px solid #efefef;

        &.header-row {
          height: 38px;
          border: 1px solid #dddddd;
          background: #f7f7f7;

          td {
            padding: 10px 20px;
            font-size: 13px;
            text-align: left;

            .dt {
              margin-right: 30px;
              font-weight: bold;
              color: #333333;
            }
          }
        }

        td {
          text-align: center;
          vertical-align: top;
          padding: 20px;

          a {
            color: inherit;
          }

          .btn-s-primary {
            box-sizing: border-box;
            width: 80px;
            height: 23px;
            padding: 1px;
            border-radius: 2px;
            color: $g-highlight;
            border-color: $g-highlight;
            font-weight: bold;
          }

          .btn-s-default {
            box-sizing: border-box;
            width: 80px;
            height: 24px;
            padding: 2px;
            border: 0;
            border-radius: 2px;
            color: #666666;
            background: #f2f2f2;
          }
        }
      }
    }
  }
</style>
