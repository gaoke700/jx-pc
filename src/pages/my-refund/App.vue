<template>
  <layout-all class="my-refund-wrap" :current-url="'my-refund.html'">
    <div class="content-header">退款/退货订单</div>
    <div v-if="total === 0" class="ui-no-data">
      <img src="~assets/images/my/order/no-refund.png"/>
      <p class="ui-no-data-text">暂无此类订单</p>
      <p class="ui-no-data-target"><a href="index.html">返回首页</a></p>
    </div>
    <div v-else class="content-body">
      <div class="search-wrap g-clearfix">
        <div class="fr">
          <div class="search-box">
            <input v-model="keyWord" type="text" placeholder="商品名称 / 商品编号 / 退款编号">
            <i @click="getRefundOrderList" class="iconfont icon-search-thin"></i>
          </div>
        </div>
      </div>
      <div class="order-wrap">
        <div class="table-wrap">
          <table class="order-table">
            <thead>
              <tr>
                <td>订单详情</td>
                <td style="width: 120px;">申请原因</td>
                <td style="width: 120px;">退款金额</td>
                <td style="width: 120px;">退款状态</td>
                <td style="width: 120px;">操作</td>
              </tr>
            </thead>
            <template v-for="v in info">
              <tbody class="split-tbody">
                <tr class="gap-row">
                  <td colspan="5"></td>
                </tr>
                <tr class="header-row">
                  <td colspan="5">
                    <span class="dt">{{v.createtime | dateFormat('YYYY-MM-DD HH:mm:ss')}}</span>
                    <span class="mr30 c6">退款编号  {{v.id}}</span>
                    <span class="c6"><a class="page-store-name" :href="v.siteUrl">{{v.storeName}}</a></span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="goods-item">
                      <div class="pic">
                        <a :href="`${v.siteUrl}detail.html?goods_id=${v.goods_id}`">
                          <img v-lazy="{src: v.thumbnail_pic, error: require('assets/images/my/order/goods-no.png')}" alt="">
                        </a>
                      </div>
                      <div class="msg">
                        <div class="name">
                          <a :href="`${v.siteUrl}detail.html?goods_id=${v.goods_id}`">{{v.name}}</a>

                        </div>
                        <div class="spec">
                          {{v.addon}}
                        </div>
                        <div class="extra">
                          <ul class="tags">
                            <!--<li class="tag">团购商品</li>-->
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="goods-num">x{{v.nums}}</div>
                  </td>
                  <td rowspan="2" class="c3">{{v.reason}}</td>
                  <td rowspan="2" class="amount">￥{{v.price}}</td>
                  <td rowspan="2">
                    <p :class="{cred:v.status === '退款失败' || v.status === '审核失败'}">{{v.status}}</p>
                  </td>
                  <td rowspan="2">
                    <a :href="`${v.siteUrl}my-refund-detail.html?aftersales_id=${v.id}&site_id=${v.site_id}&member_id=${v.member_id}`" class="c6">查看详情</a>
                  </td>
                </tr>
              </tbody>
            </template>
          </table>
        </div>

        <div class="page-wrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pageSize"
            layout="prev, pager, next, total,  jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import memberOrder from 'api/member-order';
  import LayoutAll from '../my-layout/LayoutAll';

  export default {
    data() {
      return {
        page: 1,
        pageSize: 20,
        total: 0,
        keyWord: '',
        info: [],
      };
    },
    methods: {
      getRefundOrderList() {
        memberOrder.getRefundOrderList({
          page: this.page,
          page_size: this.pageSize,
          key_word: this.keyWord,
        }).then((data) => {
          this.total = +data.count;
          this.info = data.data;
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getRefundOrderList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page = val;
        this.getRefundOrderList();
      },
    },
    created() {
      this.getRefundOrderList();
    },
    components: {
      LayoutAll,
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";
  @import "../../styles/mixins";

  .page-store-name {
    color: inherit;
    &:hover {
      color: $g-highlight;
    }
  }

  // TODO 样式基本和 my-order 的 table 一样，待共享样式
  .search-wrap {
    margin-top: 20px;
    padding: 10px 21px 0;
    background-color: white;

    .fr {
      height: 30px;
      width: 265px;
      background: #ffffff;

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
          font-size: 24px;
          right: 20px;
          top: -4px;
          color: #888888;
        }
      }
    }
  }

  .my-refund-wrap {
    .content-header {
      height: 50px;
      padding-left: 20px;
      line-height: 50px;
      font-size: 14px;
      background-color: white;
      color: #000000;
      font-weight: bold;
    }

    .content-body {
      .order-wrap {
        background-color: white;

        .table-wrap {
          padding: 13px 19px 21px;
        }

        .page-wrap {
          height: 50px;
          margin-right: 20px;
          text-align: right;
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
              }
            }

            .spec {
              position: absolute;
              bottom: 0;
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

            &.green {
              color: #4c8b03;
            }

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
            border-color: $g-highlight;
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
