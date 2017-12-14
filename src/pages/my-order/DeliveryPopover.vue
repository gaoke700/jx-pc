<template>
  <div class="delivery-popover-wrap">
    <el-popover
      placement="left"
      width="430"
      trigger="hover"
      :open-delay="300"
      @show="seeLogistics()">
      <div class="logistics-wrap">
        <div class="logistics-header">
          <span>{{ delivery.name }}</span>
          <span class="waybill-no ml5">运单号：{{ delivery.logi_no }}</span>
        </div>

        <div class="logistics-body" v-loading="isLogisticsLoading">
          <ul class="ui-timeline">
            <li class="ui-timeline-item" v-if="logisticsData.length">
              <div class="ui-timeline-item-tail"></div>
            </li>
            <li class="ui-timeline-item" v-for="(log, index) in logisticsData" v-if="index < 4">
              <div class="ui-timeline-item-tail"></div>
              <div class="ui-timeline-item-head" :class="[index === 0 ? 'ui-timeline-item-head-red' :
                                   'ui-timeline-item-head-gray']"></div>
              <div class="ui-timeline-item-content">
                <div>{{ log.AcceptStation }}</div>
                <div class="c8">{{ log.AcceptTime }}</div>
              </div>
            </li>
            <li class="ui-timeline-item" v-if="logisticsData.length > 3">
              <div class="ui-timeline-item-tail"></div>
              <div class="ui-timeline-item-head ui-timeline-item-head-gray"></div>
              <div class="ui-timeline-item-content">
                <a :href="`my-order-detail.html?order_id=${orderId}&site_id=${siteId}&member_id=${memberId}#order-delivery`" class="c3">查看更多 &gt;</a>
              </div>
            </li>
            <li class="no-data" v-if="!logisticsData.length">您的订单物流信息获取异常，请联系商家</li>
          </ul>
        </div>
      </div>

      <template slot="reference">
        <slot></slot>
      </template>
    </el-popover>
  </div>
</template>

<script>
  import memberOrder from 'api/member-order';

  export default {
    props: {
      orderId: {
        type: String,
        required: true,
      },
      siteId: {
        type: String,
        required: true,
      },
      memberId: {
        type: String,
        required: true,
      },
      delivery: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        logisticsData: '',
        isLogisticsLoading: false,
      };
    },

    methods: {
      seeLogistics() {
        this.isLogisticsLoading = true;
        memberOrder.getDelivery({
          order_id: this.orderId,
          site_id: this.siteId,
          member_id: this.memberId,
        }).then((data) => {
          this.logisticsData = data;
          this.isLogisticsLoading = false;
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .logistics-wrap {
    .logistics-header {
      margin: -2px 15px 8px 5px;
      height: 21px;
      line-height: 21px;
      font-weight: bold;
      color: #333333;
    }

    .logistics-body {
      border-top: 2px solid #dddddd;
      min-height: 100px;

      .ui-timeline {
        margin-left: 15px;

        li.no-data {
          margin-top: 40px;
          text-align: center;
          color: #888888;
        }

        .ui-timeline-item:last-child {
          .ui-timeline-item-tail {
            height: 20px;
          }
        }
      }

      .ui-timeline-item-content {
        top: -6px;
      }
    }
  }
</style>
