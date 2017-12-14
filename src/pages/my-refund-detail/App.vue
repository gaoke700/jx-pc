<template>
  <layout-all class="my-refund-detail-wrap">
    <template slot="my-menu"></template>
    <div class="refund-detail-top">
      <!--0:待审核 -->
      <div class="refund-top-text" v-if="refundInfo.status === '0'">申请已提交！等待商家审核</div>
      <!--1:退款完成-->
      <div class="refund-top-text" v-if="refundInfo.status === '1'"><i class="iconfont icon-success"></i>商家退款成功</div>
      <!--2:审核失败 -->
      <div class="refund-top-text" v-if="refundInfo.status === '2'"><i
        class="iconfont icon-warn"></i>商家拒绝{{ refundInfo.type === "reship" ? "退款退货" : "退款" }}申请
      </div>
      <!--3:终止(用户撤销)-->
      <div class="refund-top-text" v-if="refundInfo.status === '3'">{{ refundInfo.type === "reship" ? "退款退货" : "退款"
        }}结束（用户撤销）
      </div>
      <!--4:等待收货-->
      <div class="refund-top-text" v-if="refundInfo.status === '4'">商家已审核！请您退货，等待商家收货</div>
      <!--5:reship:等待退款--><!--5:refund:通过审核-->
      <div class="refund-top-text" v-if="refundInfo.status === '5'">
        {{ refundInfo.type === "reship" ? "商家已收货，等待商家处理" : "商家审核通过，等待退款" }}
      </div>
      <!--6:暂停申请-->
      <div class="refund-top-text" v-if="refundInfo.status === '6'">暂停申请</div>
      <p>退款编号：{{ refundInfo.id || '无' }}</p>
    </div>
    <div class="refund-detail-reason g-clearfix" v-if="refundInfo.status === '2'">
      <div class="info-list">
        <label>拒绝理由：</label>
        <span>{{ refundInfo.explanation }}</span>
      </div>
    </div>
    <div class="refund-detail-reason g-clearfix" v-if="refundInfo.status === '4'">
      <div class="info-list">
        <label>回寄地址信息：</label>
        <span>{{ refundInfo.address }}</span>
      </div>
    </div>
    <div class="refund-detail-info">
      <div class="goods-info">
        <div class="info-list">
          <label>商品名称：</label>
          <span>{{ refundInfoData.goods_name || '无' }}</span>
        </div>
        <div class="info-list">
          <label>退款金额：</label>
          <span>{{ refundInfo.amount || 0 }}</span>
        </div>
        <div class="info-list">
          <label>退款积分：</label>
          <span>{{ refundInfoData.order_score || 0 }}</span>
        </div>
        <div class="info-list">
          <label>退款类型：</label>
          <span>{{ refundInfo.typeName || '无' }}</span>
        </div>
        <div class="info-list">
          <label>{{ refundInfo.type === "reship" ? "退款退货" : "退款" }}原因：</label>
          <span>{{ refundInfo.reason || '无' }}</span>
        </div>
        <div class="info-list">
          <label>{{ refundInfo.type === "reship" ? "退款退货" : "退款" }}说明：</label>
          <span>{{ refundInfo.description || '无' }}</span>
        </div>
      </div>
      <div class="custom-info">
        <div class="info-list">
          <label>退款账号：</label>
          <span>{{ refundInfo.account || '无' }}</span>
        </div>
        <div class="info-list">
          <label>联系方式：</label>
          <span>{{ refundInfo.phone || '无' }}</span>
        </div>
        <div class="info-list">
          <label>申请时间：</label>
          <span>{{ refundInfo.create_time | dateFormat('YYYY-MM-DD') || '无'
            }} {{ refundInfo.create_time | dateFormat('HH:mm:ss') }}</span>
        </div>
        <div class="info-list">
          <label>协商记录：</label>
          <span class="logs" @click="getRefundLog">点击查看</span>
        </div>
      </div>
    </div>
    <div class="refund-detail-btn">
      <div class="button-box">
        <a href="javascrip:void(0)" @click="repealFun()"
           v-if="refundInfo.status === '0' || refundInfo.status === '2' || refundInfo.status === '4' || (refundInfo.status === '5' && refundInfo.type === 'reship')">撤销申请</a>
        <a href="javascrip:void(0)" v-if="refundInfo.status === '0'" @click="refundApply(refundInfo)">修改申请</a>
        <a href="javascript:;"
           v-if="refundInfo.status === '2' || (refundInfo.status === '5' && refundInfo.type === 'reship')"
           @click="refundApply(refundInfo)">再次申请</a>
        <a href="javascrip:void(0)" @click="logisticsFun()" v-if="refundInfo.status === '4'">填写退货信息</a>
        <a href="my-order.html">返回订单列表</a>
      </div>
    </div>
    <!--撤销申请-dialog-->
    <el-dialog
      custom-class="dialog-repeal"
      :visible.sync="repealDialog">
      <span slot="title">撤销申请</span>
      <p>撤销申请后，您将无法对此商品再次发起退款申请
        确定撤销么？</p>
      <template slot="footer" class="dialog-footer">
        <el-button @click="repealDialog = false;">取 消</el-button>
        <el-button type="primary" @click="repealDialogSave()">确 定</el-button>
      </template>
    </el-dialog>
    <!--填写退货信息-dialog-->
    <el-dialog
      custom-class="dialog-logistics"
      :visible.sync="logisticsDialog">
      <span slot="title">退货物流</span>
      <el-form ref="postLogisticsForm" :model="postLogisticsForm" :rules="editLogisticsRules" label-width="80px">
        <el-form-item label="配送物流：" prop="logi_name">
          <el-input v-model="postLogisticsForm.logi_name" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="物流单号：" prop="logi_no">
          <el-input v-model="postLogisticsForm.logi_no" style="width: 200px;" :maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer" class="dialog-footer">
        <el-button type="primary" @click="logisticsDialogSave()">保 存</el-button>
      </template>
    </el-dialog>
    <!--修改申请-dialog-->
    <refund-dialog :showRefundDialog="applyDialog" ref="refundDialog"></refund-dialog>
    <!--协商记录-dialog-->
    <el-dialog
      custom-class="dialog-refund-log"
      :visible.sync="refundLogDialog"
    >
      <span slot="title">协商记录</span>
      <div class="refund-log-wrap">
        <ul class="confer-log">
          <li :class="{ 'buyer': item.op_type === 'member', 'boss': item.op_type === 'admin' }"
              v-for="item in refundLogData">
            <div class="log-box">
              <div class="date">{{ item.create_time | dateFormat('YYYY-MM-DD')
                }} {{ item.create_time | dateFormat('HH:mm:ss') }}
              </div>
              <div class="log-content">
                <h2 class="title">{{ item.title}}</h2>
                <ul class="reason"
                    v-if=" (item.op_type === 'admin' && item.explanation !== '') || item.op_type === 'member' ">
                  <li v-if="item.op_type === 'admin' && item.explanation !== '' ">
                    <label>理由：</label>
                    <span>{{ item.explanation || '无' }}</span>
                  </li>
                  <li v-if="item.op_type === 'member'">
                    <label>退款类型：</label>
                    <span>{{ item.snapshot && item.snapshot.typeName || '无' }}</span>
                  </li>
                  <li v-if="item.op_type === 'member'">
                    <label>退款原因：</label>
                    <span>{{ item.snapshot && item.snapshot.reason || '无' }}</span>
                  </li>
                  <li v-if="item.op_type === 'member'">
                    <label>退款金额：</label>
                    <span>￥{{ item.snapshot && item.snapshot.amount || 0 }}</span>
                  </li>
                  <li v-if="item.op_type === 'member'">
                    <label>退还积分：</label>
                    <span>{{ item.snapshot && item.snapshot.score || 0 }}</span>
                  </li>
                  <li v-if="item.op_type === 'member'">
                    <label>退款说明：</label>
                    <span>{{ item.snapshot && item.snapshot.description || '无' }}</span>
                  </li>
                  <li v-if="item.op_type === 'member'">
                    <label>退款账号：</label>
                    <span>{{ item.snapshot && item.snapshot.account || '无' }}</span>
                  </li>
                </ul>
                <i class="arrow"></i>
              </div>
              <a class="icon" href="javascript:void(0)" title=""></a>
            </div>
          </li>
        </ul>
      </div>
      <template slot="footer" class="dialog-footer">
        <el-button @click="refundLogDialog = false;">确认</el-button>
      </template>
    </el-dialog>
  </layout-all>
</template>

<script>
  import { getQueryParams } from 'utils/queryStr';
  import memberOrder from 'api/member-order';
  import validate from '@/common/validate';
  import RefundDialog from '../my-order-detail/RefundDialog';
  import LayoutAll from '../my-layout/LayoutAll';

  const checkLogiName = (rule, value, cb) => {
    validate.falsely(value, cb, '请输入配送物流');
    cb();
  };
  const checkLogiNo = (rule, value, cb) => {
    validate.falsely(value, cb, '请输入物流单号');
    cb();
  };

  export default {
    components: {
      LayoutAll,
      RefundDialog,
    },

    data() {
      return {
        params: {
          aftersales_id: '',
          site_id: '',
          member_id: '',
          to_status: '',
        },
        refundInfoData: [],
        refundInfo: [],
        repealDialog: false, // 撤销弹框
        logisticsDialog: false, // 填写物流单号
        applyDialog: false, // 再次申请
        refundLogDialog: false, // 协商弹框
        postLogisticsForm: {
          logi_name: '',
          logi_no: '',
        },
        editLogisticsRules: {
          logi_name: [{ validator: checkLogiName, trigger: 'blur' }],
          logi_no: [{ validator: checkLogiNo, trigger: 'blur' }],
        },
        refundLogData: [],
      };
    },

    created() {
      this.params = getQueryParams();

      this.getRefundOrderInfo();
    },

    methods: {
      getRefundOrderInfo() {
        memberOrder.getRefundOrderInfo(this.params).then((res) => {
          this.refundInfoData = res;
          this.refundInfo = res.aftersales;
        });
      },

      repealFun() {
        this.repealDialog = true;
      },

      repealDialogSave() {
        memberOrder.postRefundRepeal({
          ...this.params,
          to_status: 3,
        }).then(() => {
          window.location.reload();
        });
      },

      logisticsFun() {
        this.logisticsDialog = true;
        // 避免编辑后再打开添加收货人时会进行地址必须校验
        if (this.$refs.postLogisticsForm) {
          this.$nextTick(() => {
            this.$refs.postLogisticsForm.resetFields();
          });
        }
      },

      // 填写物流信息--保存
      logisticsDialogSave() {
        this.editLogisticsRules = {
          ...this.editLogisticsRules,
        };

        this.$refs.postLogisticsForm.validate((valid) => {
          if (!valid) return;

          memberOrder.postRefundLogistics({
            ...this.params,
            ...this.postLogisticsForm,
          }).then(() => {
            this.logisticsDialog = false;
            this.$message({
              message: '填写成功',
            });
          });
        });
      },

      refundApply({ item_id, site_id, order_id, member_id }) {
        this.$refs.refundDialog.refundApply({ item_id, site_id, order_id, member_id });
      },

      // 协商
      getRefundLog() {
        this.editLogisticsRules = {};
        memberOrder.getRefundLog(this.params).then((data) => {
          this.refundLogDialog = true;
          this.refundLogData = data;
          console.log(4, data, this.refundLogData);
        });
      },
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  .my-refund-detail-wrap {
    .personal-center .content-wrap {
      margin-top: 0;
    }

    $red: $g-highlight;
    color: #333333;

    .el-dialog__header {
      font-size: 14px;
    }

    .el-form-item {
      margin-bottom: 20px;

      .el-form-item__label {
        line-height: 30px;
        padding: 0;
        font-size: 12px;
        color: #333333;
      }

      .el-form-item__content {
        line-height: 30px;
        font-size: 12px;
        color: #333333;

        input {
          height: 30px;
        }
      }
    }

    .info-list {
      position: relative;
      font-size: 14px;
      color: #333333;

      label {
        display: inline-block;
        width: 104px;
        line-height: 34px;
        margin-right: 15px;
        position: absolute;
        left: 0;
        top: 0;
        text-align: right;
        vertical-align: top;
      }

      span {
        display: inline-block;
        min-height: 34px;
        line-height: 34px;
        margin-left: 119px;
        color: #666666;
        text-align: left;
        vertical-align: top;
        &.logs {
          text-decoration: underline;
          color: #006de7;
          cursor: pointer;
        }
      }
    }

    .refund-detail-top {
      margin: 38px 0;

      .refund-top-text {
        line-height: 30px;
        margin-bottom: 18px;
        font-size: 24px;
        font-weight: bold;
        color: #333333;
        text-align: center;

        i {
          font-size: 30px;
          vertical-align: middle;
          margin-right: 20px;
          color: #d0021b;

          &.icon-success {
            color: #4c8b03;
          }
        }
      }

      p {
        font-size: 14px;
        color: #666666;
        text-align: center;
      }
    }

    .refund-detail-reason {
      margin-bottom: 20px;
      padding: 10px 40px;
      background-color: white;
    }

    .refund-detail-info {
      margin-bottom: 20px;
      padding: 20px 40px;
      background-color: white;
      .goods-info {
        padding-bottom: 60px;
        border-bottom: 1px solid #dddddd;
      }
      .custom-info {
        padding-top: 30px;
      }
    }

    .refund-detail-btn {
      margin-bottom: 20px;
      background-color: white;
      .button-box {
        padding: 30px 0;
        text-align: center;
        a {
          display: inline-block;
          width: 150px;
          height: 40px;
          line-height: 40px;
          margin: 0 20px;
          background: $g-highlight;
          border: 0;
          border-radius: 4px;
          font-size: 16px;
          color: #ffffff;
          text-align: center;
          cursor: pointer;
        }
      }
    }

    .dialog-repeal {
      width: 400px;

      p {
        line-height: 32px;
        font-size: 16px;
        text-align: center;
      }
    }

    .dialog-logistics {
      width: 380px;
    }

    .dialog-refund-log {
      width: 760px;

      .refund-log-wrap {
        width: 720px;
        height: 490px;
        background: #f7f7f7;

        ul.confer-log {
          height: 490px;
          padding: 20px;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          overflow: auto;

          li {
            margin-bottom: 20px;

            .log-box {
              position: relative;
              padding-right: 32px;
              overflow: hidden;

              .date {
                line-height: 18px;
                margin-right: 23px;
                font-size: 12px;
                color: #b9b9b9;
                text-align: right;
              }

              .log-content {
                float: right;
                position: relative;
                width: 290px;
                min-height: 20px;
                margin-right: 15px;
                padding: 10px;
                border: 1px solid #fa7d50;
                border-radius: 5px;
                background: #ffffff;

                h2.title {
                  line-height: 20px;
                  font-size: 14px;
                  font-weight: normal;
                  color: #333333;
                }

                .reason {
                  margin-top: 4px;
                  padding: 10px;
                  background: #f9f9f9;
                  font-size: 12px;
                  color: #888888;
                  white-space: normal;

                  li {
                    position: relative;
                    min-height: 20px;
                    margin-bottom: 0;
                    font-size: 12px;

                    label {
                      display: inline-block;
                      width: 60px;
                      line-height: 20px;
                      margin-right: 5px;
                      position: absolute;
                      left: 0;
                      top: 0;
                      text-align: left;
                    }

                    span {
                      display: inline-block;
                      line-height: 20px;
                      margin-left: 65px;
                      color: #666666;
                      text-align: left;
                    }
                  }
                }
              }

              .arrow {
                position: absolute;
                top: 15px;
                right: -6px;
                z-index: 10;
                width: 10px;
                height: 10px;
                border-top: 1px solid #fa7d50;
                border-left: 1px solid #fa7d50;
                background: #ffffff;
                transform: rotate(135deg);
                -webkit-transform: rotate(135deg);
              }

              a.icon {
                display: block;
                position: absolute;
                top: 20px;
                right: 0;
                z-index: 10;
                width: 32px;
                height: 32px;
                background: url('~assets/images/my/refund-detail/buyer.png');
                text-align: center;
                overflow: hidden;
              }
            }

            &.boss {
              .log-box {
                padding-left: 32px;
                padding-right: 0;
              }

              .date {
                text-align: left;
                margin-left: 23px;
              }

              .log-content {
                float: none;
                margin-left: 15px;
                margin-right: 0;
                border: 1px solid #5b95ce;

                .reason {
                  li {
                    label {
                      width: 40px;
                    }

                    span {
                      margin-left: 40px;
                    }
                  }
                }
              }

              .arrow {
                left: -6px;
                border-top-color: #5b95ce;
                border-left-color: #5b95ce;
                transform: rotate(-45deg);
                -webkit-transform: rotate(-45deg);
              }

              a.icon {
                left: 0;
                background: url('~assets/images/my/refund-detail/boss.png');
              }
            }
          }
        }
      }
    }
  }
</style>
