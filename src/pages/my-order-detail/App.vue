<template>
  <layout-all class="my-order-detail-wrap">
    <template slot="my-menu"></template>
    <template slot="my-container">
      <div class="content-header">
        <div class="breadcrumb">
          <span class="breadcrumb-item">
            <span class="breadcrumb-item-inner">订单中心</span>
            <span class="breadcrumb-item-separator">&gt;</span>
          </span>
          <span class="breadcrumb-item">
            <span class="breadcrumb-item-inner"><a href="my-order.html">我的订单</a></span>
            <span class="breadcrumb-item-separator">&gt;</span>
          </span>
          <span class="breadcrumb-item">
            <span class="breadcrumb-item-inner">订单号 {{ orderData.order_id }}</span>
          </span>
        </div>
      </div>

      <div class="content-body">
        <!-- 订单状态 -->
        <order-status :orderData="orderData" v-if="orderData.order_id"></order-status>

        <!-- 物流跟踪 -->
        <delivery-track :orderData="orderData" v-if="orderData.order_id"></delivery-track>

        <!-- 订单信息 -->
        <order-info :orderData="orderData" v-if="orderData.order_id"></order-info>

        <!-- 订单商品 -->
        <order-goods :orderData="orderData" v-if="orderData.order_id"></order-goods>
      </div>
    </template>
  </layout-all>
</template>

<script>
  import memberOrder from 'api/member-order';
  import { getQueryParams } from 'utils/queryStr';
  import LayoutAll from '../my-layout/LayoutAll';
  import OrderStatus from './OrderStatus';
  import DeliveryTrack from './DeliveryTrack';
  import OrderInfo from './OrderInfo';
  import OrderGoods from './OrderGoods';

  export default {
    components: {
      LayoutAll,
      OrderStatus,
      DeliveryTrack,
      OrderInfo,
      OrderGoods,
    },

    data() {
      return {
        orderData: {},
      };
    },

    methods: {
      getDetail(params) {
        memberOrder.getDetail(params).then((data) => {
          this.orderData = data;
        });
      },
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

  .my-order-detail-wrap {
    &,
    * {
      box-sizing: border-box;
    }

    .personal-center {
      .main-content {
        display: none;
      }

      .content-wrap {
        margin-top: 0;
        padding-bottom: 20px;
      }
    }

    .content-header {
      height: 50px;
      padding-left: 20px;
      line-height: 50px;
      font-size: 14px;
      background-color: white;

      .breadcrumb {
        font-size: 14px;

        .breadcrumb-item-inner {
          margin-right: 5px;

          a {
            color: inherit;

            &:hover {
              color: $g-highlight;
            }
          }
        }

        .breadcrumb-item-separator {
          color: #888888;
        }
      }
    }
  }
</style>
