<template>
  <layout-all class="my-order-wrap" :current-url="'my-order.html'">
    <div class="content-header">我的订单</div>
    <div class="content-body">
      <div class="order-wrap" v-if="orderCount.order_all_count !== '0'">
        <div class="search-wrap g-clearfix">
          <ul class="fl">
            <li v-for="item in filterList" :class="{ curr: filterType === item.type, disable: item.disable }"
                @click="orderFilter(item)">
              {{ item.title }} <span class="num">{{ item.count }}</span>
            </li>
          </ul>
          <div class="fr">
            <div class="search-box">
              <input type="text" v-model="keyword" placeholder="商品名称 / 商品编号 / 订单号"
                     @keyup.enter="getList({ key_word: keyword })">
              <i class="iconfont icon-search-thin" @click="getList({ key_word: keyword })"></i>
            </div>
          </div>
        </div>

        <div class="table-wrap">
          <table class="order-table">
            <thead>
            <tr>
              <td style="width: 570px;">订单详情</td>
              <td style="width: 121px;">收货人</td>
              <td style="width: 121px;">金额</td>
              <td style="width: 121px;">订单状态</td>
              <td style="width: 121px;">操作</td>
            </tr>
            </thead>

            <tbody class="split-tbody" v-for="item in orderList">
            <tr class="gap-row">
              <td colspan="5"></td>
            </tr>
            <tr class="header-row">
              <td colspan="5">
                <span class="dt">{{ item.createtime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
                <span class="mr30 c6">订单号
                  <template v-if="item.orderStatus.isCanceled">{{ item.order_id }}</template>
                  <a class="c6" v-else
                     :href="`${item.siteUrl}my-order-detail.html?order_id=${item.order_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`">{{ item.order_id}}</a>
                </span>
                <a :href="item.siteUrl" target="_blank" class="c6">{{ item.storeInfo && item.storeInfo.store_name }}</a>
              </td>
            </tr>

            <!--订单中商品列表-->
            <tr v-for="(goods, goods_idx) in item.goods_info" v-if="goods_idx < 4">
              <!--订单详情-->
              <td>
                <div class="goods-item">
                  <div class="pic">
                    <a
                      :href="`${item.siteUrl}detail.html?goods_id=${goods.goods_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`"
                      target="_blank">
                      <img v-lazy="{src: goods.thumbnail_pic, error: require('assets/images/my/order/goods-no.png')}">
                    </a>
                  </div>
                  <div class="msg">
                    <div class="name">
                      <a
                        :href="`${item.siteUrl}detail.html?goods_id=${goods.goods_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`"
                        target="_blank">{{ goods.name }}</a>
                    </div>
                    <div class="extra">
                      <span class="c6">{{ goods.pdt_desc }}</span>
                    </div>
                    <!-- <div class="extra">
                       <ul class="tags">
                         <li class="tag">团购商品</li>
                       </ul>
                     </div>-->
                  </div>
                </div>

                <div class="goods-num">x{{ goods.nums }}</div>

                <!--仅 订单已取消 并 已收货，不显示商品状态-->
                <div class="goods-status c6" v-if="!item.orderStatus.isCanceled && item.status !== 'finish'">
                  <!--未付款-->
                  <a v-if="goods.refund_status === '0'" href="javascript:;"
                     @click="refundApply(goods, item.storeInfo.site_id, item.member_id)">{{ goods.refund_info }}</a>
                  <!--付款后-->
                  <a v-if="['1', '2', '3'].indexOf(goods.refund_status) > -1"
                     :class="{cgreen: goods.refund_status === '3'}"
                     target="_blank"
                     :href="`${item.siteUrl}my-refund-detail.html?aftersales_id=${goods.aftersalesId}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`">{{ goods.refund_info}}</a>
                  <span v-if="['0', '1', '2', '3'].indexOf(goods.refund_status) === -1" style="color: #4c8b03;">
                    {{ goods.refund_info }}
                  </span>
                </div>
              </td>

              <!--收货人-->
              <td :rowspan="item.rowSpan" v-if="goods_idx === 0" class="c3">{{ item.ship_name }}</td>

              <!--金额-->
              <td :rowspan="item.rowSpan" v-if="goods_idx === 0" class="amount">
                <template v-if="item.orderStatus.isPayWait">
                  <p class="c9b mb10">总额￥{{ item.total_amount }}</p>
                  <p class="c3">应付</p>
                  <p class="c3 total-amount">￥{{ item.final_amount }}</p>
                  <p class="c9b">（含运费{{ item.cost_freight }}元）</p>
                </template>
                <template v-else>
                  <p class="c9b mb10">总额￥{{ item.total_amount }}</p>
                </template>
              </td>

              <!--订单状态-->
              <td :rowspan="item.rowSpan" v-if="goods_idx === 0">
                <!--订单状态：待支付显示红色，其余显示灰色-->
                <p class="mb10" :class="[item.orderStatus.isPayWait ? 'cred': 'c9b']">{{ item.order_status }}</p>
                <!--查看物流信息：已发货 & 未被取消 & 普通快递-->
                <template v-if="item.orderStatus.isDelivery
                  && !item.orderStatus.isCanceled
                  && item.delivery_type === DELIVERY_COMMON">
                  <p class="mb10">
                    <delivery-popover
                      :orderId="item.order_id"
                      :siteId="item.storeInfo.site_id"
                      :memberId="item.member_id"
                      :delivery="item.delivery">
                      <a href="javascript:;" class="c3 un-read">查看物流</a>
                    </delivery-popover>
                  </p>
                </template>
                <!--已取消订单：跳到已取消订单详情页，否则跳到订单详情页-->
                <p v-if="item.orderStatus.isCanceled">
                  <a
                    :href="`my-order-detail.html?order_id=${item.order_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`"
                    class="c3">订单详情</a>
                </p>
                <!--<p v-else><a :href="`${item.siteUrl}my-order-detail.html?order_id=${item.order_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`" class="c3">订单详情</a></p>-->
                <p v-else>
                  <a
                    :href="`my-order-detail.html?order_id=${item.order_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`"
                    class="c3">订单详情</a>
                </p>
              </td>

              <!--操作-->
              <td :rowspan="item.rowSpan" v-if="goods_idx === 0">
                <!--已关闭的订单无操作-->
                <template v-if="!item.orderStatus.isClosed">
                  <!--待支付时：显示剩余支付时间 & 付款 & 取消订单-->
                  <template v-if="item.orderStatus.isPayWait">
                    <p class="mb10 c3" v-if="item.surplus_pay_time_show === '1'">剩余{{ item.surplus_pay_time }}</p>
                    <p class="mb10">
                      <a :href="`../pay.html?order_id=${item.order_id}&pay_type=2`" target="_blank"
                         class="ui-button btn-s-primary">付款</a></p>
                    <p><a href="javascript:;" class="c3"
                          @click="orderCancel(item.order_id, item.storeInfo.site_id, item.member_id)">取消订单</a></p>
                  </template>
                  <!--确认收货：已发货 & 未收货 & 未完成 & 未取消时显示-->
                  <template v-if="item.orderStatus.isDelivery
                    && !item.orderStatus.isReceipt
                    && !item.orderStatus.isFinished
                    && !item.orderStatus.isCanceled">
                    <a href="javascript:;"
                       @click="orderConfirm({orderId: item.order_id, siteId: item.storeInfo.site_id, goods: item.goods_info, memberId: item.member_id})"
                       class="ui-button btn-s-primary">确认收货</a>
                  </template>
                  <!--收货之后可 立即评价-->
                  <template v-if="item.orderStatus.isReceipt">
                    <a
                      :href="`my-comment.html?order_id=${item.order_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`"
                      class="ui-button btn-s-primary"
                      target="_blank">立即评价</a>
                  </template>
                  <!--评价之后可 查看评价-->
                  <template v-if="item.orderStatus.isFinished">
                    <a
                      :href="`my-comment-detail.html?order_id=${item.order_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}`"
                      target="_blank" class="c6">查看评价</a>
                  </template>
                  <!--取消订单之后可 立即购买-->
                  <template v-if="item.orderStatus.isCanceled">
                    <p class="mb10">
                      <a href="javascript:;" class="ui-button btn-s-default" @click="buyNow(item)">立即购买</a></p>
                  </template>
                </template>
              </td>
            </tr>

            <!--商品多于4个则显示4个-->
            <tr v-if="item.goodsCount > 4">
              <td class="goods-more c8">
                <a
                  :href="`${item.siteUrl}my-order-detail.html?order_id=${item.order_id}&site_id=${item.storeInfo.site_id}&member_id=${item.member_id}#order-goods`">查看更多商品</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <refund-dialog :showRefundDialog="showRefundDialog" ref="refundDialog"></refund-dialog>

        <div class="page-wrap" v-if="orderList.length > 0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pagination.size"
            layout="prev, pager, next, total, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
      <div class="order-no-data" v-else>
        <img src="~assets/images/my/order/no-order.png" alt="no-data">
        <div class="msg-wrap">
          <p class="msg">您还没有任何订单，快去选购好货</p>
          <p class="home"><a href="index.html">返回首页</a></p>
        </div>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import memberOrder from 'api/member-order';
  import { REFUND_STATUS, DELIVERY_TYPE, DELIVERY_COMMON } from '@/common/consts';
  import LayoutAll from '../my-layout/LayoutAll';
  import commonMixin from '../my-order-detail/common';
  import RefundDialog from '../my-order-detail/RefundDialog';
  import DeliveryPopover from './DeliveryPopover';

  export default {
    mixins: [commonMixin],

    components: {
      LayoutAll,
      RefundDialog,
      DeliveryPopover,
    },

    data() {
      return {
        REFUND_STATUS,
        DELIVERY_TYPE,
        DELIVERY_COMMON,
        keyword: '',
        orderList: [],
        pagination: {
          page: 1,
          total: 0,
          size: 20,
        },
        orderCount: {},
        filterType: '', // 订单筛选条件
        logisticsData: [],
        isLogisticsLoading: false,
        showRefundDialog: false,
      };
    },

    computed: {
      filterList() {
        return [
          { type: '', title: '全部订单', count: this.orderCount.order_all_count },
          { type: 'unpay', title: '待付款', count: this.orderCount.order_ready_pay_count },
          { type: 'receipt', title: '待收货', count: this.orderCount.order_in_shipping_count },
          { type: 'comment', title: '待评价', count: this.orderCount.order_ready_comment_count },
        ].map(item => ({
          ...item,
          disable: item.count === '0',
        }));
      },
    },

    methods: {
      getList(params) {
        memberOrder.getList({
          page: this.pagination.page,
          page_size: this.pagination.size,
          order_status: this.filterType,
          ...params,
        }).then((res) => {
          this.orderList = this.formatData(res.data);
          this.pagination.total = +res.count;

          this.orderCount = {
            order_all_count: res.order_all_count,
            order_in_shipping_count: res.order_in_shipping_count,
            order_ready_comment_count: res.order_ready_comment_count,
            order_ready_pay_count: res.order_ready_pay_count,
          };
        });
      },
      formatData(data) {
        const result = [];
        if (!data) return result;

        data.forEach((item) => {
          const goodsCount = item.goods_info.length;
          const orderStatus = this.getOrderStatus(item);

          result.push({
            ...item,
            goodsCount,
            rowSpan: goodsCount > 4 ? 5 : goodsCount,
            orderStatus,
          });
        });
        return result;
      },
      orderFilter({ type, count }) {
        if (count === '0' || type === this.filterType) return;

        this.filterType = type;
        this.getList({ order_status: type });
      },
      handleCurrentChange(page) {
        this.getList({ page });
      },
      handleSizeChange(size) {
        this.pagination.size = size;
        this.getList();
      },
      buyNow(item) {
        const product = item.goods_info.map(prod => ({
          product_id: prod.pid,
          product_num: prod.nums,
        }));
        localStorage.cartListInfo = JSON.stringify([{ site_id: item.storeInfo.site_id, product }]);
        location.href = '../order.html?source=cart';
      },
      refundApply({ item_id, order_id }, site_id, member_id) { // eslint-disable-line
        this.$refs.refundDialog.refundApply({ item_id, order_id, site_id, member_id });
      },
    },

    created() {
      this.getList();
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .my-order-wrap {
    .content-header {
      height: 50px;
      padding-left: 20px;
      line-height: 50px;
      font-size: 14px;
      background-color: white;
      font-weight: bold;
    }

    .content-body {
      a:hover {
        color: $g-highlight;
      }

      .search-wrap {
        padding: 10px 21px 0;

        li {
          float: left;
          margin-right: 50px;
          font-size: 16px;
          cursor: pointer;
          font-weight: bold;

          .num {
            margin-left: 5px;
            color: $g-highlight;
          }

          &.curr {
            height: 27px;
            border-bottom: 3px solid $g-highlight;
            color: $g-highlight;
          }

          &.disable {
            cursor: inherit;
            // opacity: 0.5;
          }
        }

        .fr {
          height: 30px;
          width: 265px;

          .search-box {
            box-sizing: border-box;
            position: relative;
            height: 100%;
            padding: 7px 18px;
            border: 1px solid #d0ced1;
            border-radius: 3px;

            input {
              position: absolute;
              top: 6px;
              width: 200px;
              height: 16px;
              border: 0;
            }

            .iconfont {
              position: absolute;
              font-size: 22px;
              right: 20px;
              top: -2px;
              color: #888888;
              cursor: pointer;
            }
          }
        }
      }

      .order-wrap {
        margin-top: 20px;
        background-color: white;

        .table-wrap {
          padding: 13px 19px 21px;
        }
      }

      .page-wrap {
        height: 50px;
        margin-right: 20px;
        text-align: right;
      }

      .order-no-data {
        position: relative;
        height: 470px;
        margin-top: 20px;
        background-color: white;

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
        }
      }
    }
  }

  .order-table {
    width: 100%;

    thead {
      tr {
        background-color: #f7f7f7;

        td {
          height: 34px;
          font-size: 13px;
          text-align: center;
          color: #4a4a4a;
        }
      }
    }

    tbody {
      tr {
        &.gap-row {
          height: 20px;
          border: 0;

          td {
            padding: 0;
            border: 0;
          }
        }

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
          border: 1px solid #efefef;

          a {
            &.un-read {
              position: relative;

              &::after {
                content: ' ';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: -10px;
                display: inline-block;
                width: 5px;
                height: 5px;
                vertical-align: middle;
                border-radius: 100%;
                background-color: $g-highlight;
              }
            }
          }

          .goods-item {
            position: relative;
            float: left;
            width: 360px;
            margin-right: 53px;

            .pic {
              float: left;
              width: 80px;
              height: 80px;
              background-color: #efefef;

              img {
                width: 80px;
                height: 80px;
              }
            }

            .msg {
              float: left;
              width: 260px;
              margin-left: 20px;

              .name {
                word-break: break-all;
                @include multi-line-ellipsis(1.5em, 3);
              }

              a {
                color: black;

                &:hover {
                  color: $g-highlight;
                }
              }
            }

            .extra {
              position: absolute;
              bottom: 0;
            }

            .tags {
              .tag {
                display: inline-block;
                margin-right: 10px;
                padding: 0 5px;
                font-size: 10px;
                color: white;
                background-color: #fa0321;
              }
            }
          }

          .goods-num {
            float: left;
            height: 80px;
            color: #888888;
          }

          .goods-status {
            float: left;
            width: 78px;
            height: 80px;
            margin-left: 20px;

            .cgreen {
              color: #4c8b03;
            }

            a {
              color: inherit;
            }
          }

          &.goods-more {
            padding: 10px;
            text-align: center;

            a {
              color: inherit;
            }
          }

          &.amount {
            padding: 20px 4px;
            font-size: 13px;

            .total-amount {
              font-size: 14px;
              font-weight: bold;
            }
          }

          .btn-s-primary {
            box-sizing: border-box;
            width: 80px;
            height: 23px;
            padding: 1px;
            border-radius: 2px;
            color: $g-highlight;
            font-weight: bold;
            border-color: $g-highlight;

            &:hover {
              color: $g-highlight;
            }
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

            &:hover {
              color: #666666;
            }
          }
        }
      }
    }
  }
</style>
