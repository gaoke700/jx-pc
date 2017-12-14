<template>
  <el-dialog
    custom-class="dialog-refund"
    @close="dialogClose"
    :close-on-click-modal="false"
    :visible.sync="showRefundDialogInner">
    <span slot="title">申请退款</span>
    <el-form ref="refundForm" :model="refundForm" :rules="refundRules" label-width="100px">
      <el-form-item label="申请服务：" prop="type" v-if="refundInfo.apply_refund_types">
        <template v-if="refundInfo.apply_refund_types.length === 1">{{ TYPE_MAP[refundForm.type] }}</template>
        <template v-if="refundInfo.apply_refund_types.length === 2">
          <el-select v-model="refundForm.type">
            <el-option v-for="(type, index) in refundInfo.apply_refund_types"
                       :key="index"
                       :label="TYPE_MAP[type]"
                       :value="type"></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="退款原因：" prop="reason">
        <el-select v-model="refundForm.reason">
          <el-option v-for="(item, index) in refundInfo.reason_list[refundForm.type]"
                     :key="index"
                     :label="item"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款说明：">
        <textarea v-model="refundForm.description" :maxlength="100" class="mr5"></textarea>
        {{refundForm.description.length}}<span class="c8">/100</span>
        <el-form-item label="">
          <upload :fileList="files" :params="{site_id: refundForm.site_id}" @on-change="onChange"></upload>
        </el-form-item>
      </el-form-item>
      <el-form-item label="退款数量：">{{ refundForm.nums }}</el-form-item>
      <el-form-item label="退款金额：" prop="amount">
        <el-input v-model="refundForm.amount" type="number" min="0" :max="refundInfo.price"
                  style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="退款积分：">{{ refundForm.score }}</el-form-item>
      <el-form-item label="退款账号：" prop="account">
        <el-input v-model="refundForm.account" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model="refundForm.phone" style="width: 200px;"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button class="ui-button btn-submit" :loading="submitLoading" @click="submitRefund">提交申请</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import memberOrder from 'api/member-order';
  import validate from '@/common/validate';

  const TYPE_MAP = {
    refund: '仅退款',
    reship: '退款退货',
  };

  export default {
    props: {
      showRefundDialog: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      const checkAmount = (rule, value, cb) => {
        validate.falsely(value, cb, '请填写退款金额');
        if (value > +this.refundInfo.price) cb(new Error('退款金额超过可申请金额！'));
        if (value < 0) cb(new Error('退款金额不能小于0！'));
        cb();
      };
      const checkMobile = (rule, value, cb) => {
        validate.falsely(value, cb, '请输入手机号');
        validate.mobile(value, cb);
        cb();
      };

      function checkRequired(msg) {
        return (rule, value, cb) => {
          validate.falsely(value, cb, msg);
          cb();
        };
      }

      return {
        TYPE_MAP,
        submitLoading: false,
        files: [],
        refundRules: {
          type: [{ validator: checkRequired('请选择申请服务类型') }],
          reason: [{ validator: checkRequired('请选择退款原因') }],
          account: [{ validator: checkRequired('请填写退款账号') }],
          amount: [{ validator: checkAmount, trigger: 'blur' }],
          phone: [{ validator: checkMobile, trigger: 'blur' }],
        },
        refundForm: {
          item_id: '',
          type: '',
          reason: '',
          amount: '',
          score: '',
          account: '',
          phone: '',
          site_id: '',
          images: '',
          description: '',
        },
        refundInfo: {
          typeName: '',
          apply_refund_types: [],
          reason_list: {},
          price: 0,
        },
        showRefundDialogInner: this.showRefundDialog,
        memberId: '',
        siteId: '',
      };
    },

    methods: {
      // 申请退款
      refundApply({ item_id, site_id, order_id, member_id, price }) {
        this.refundInfo.price = +price || 0;
        this.memberId = member_id; // eslint-disable-line
        this.siteId = site_id; // eslint-disable-line

        this.showRefundDialogInner = true;
        memberOrder.getOrderRefund({ item_id, site_id, order_id, member_id }).then((data) => {
          this.refundForm = {
            ...this.refundForm,
            item_id,
            site_id,
            type: data.type,
            amount: data.price,
            description: data.description || '',
            score: data.order_score,
            account: data.account,
            phone: data.phone,
            nums: data.nums,
            reason: data.reason,
            images: (data.images || []).map(o => o.image_id).join(),
          };

          this.files = (data.images || []);

          this.refundInfo = {
            typeName: data.type_name,
            apply_refund_types: data.apply_refund_types,
            reason_list: data.reason_list,
            price: data.price,
          };
        });
      },
      onChange(fileList) {
        this.refundForm.images = fileList.map(o => o.image_id).join();
        this.files = fileList;
      },
      // 提交申请
      submitRefund() {
        this.$refs.refundForm.validate((valid) => {
          if (!valid) return;

          this.submitLoading = true;
          memberOrder.postOrderRefund({
            ...this.refundForm,
            member_id: this.memberId,
          }).then((data) => {
            if (data.aftersalesId) {
              this.submitLoading = false;
              this.showRefundDialogInner = false;
              this.$message({
                message: '提交退款申请成功',
                onClose: () => {
                  window.location.href = `my-refund-detail.html?aftersales_id=${data.aftersalesId}&site_id=${this.siteId}&member_id=${this.memberId}`;
                  window.location.reload();
                },
              });
            } else {
              this.$message('提交退款申请失败');
            }
          }).catch((error) => {
            // FIXME 第一次 message 没有显示出来
            this.$message({
              message: error.errMsg,
              onClose: () => {
                this.submitLoading = false;
              },
            });
          });
        });
      },
      dialogClose() {
        this.submitLoading = false;
      },
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  .dialog-refund {
    width: 760px;

    .el-form-item__label {
      color: #333333;
    }

    .el-dialog__body {
      padding: 25px 20px 0;
    }

    .el-dialog__footer {
      padding: 40px 20px;
    }

    textarea {
      width: 530px;
      height: 80px;
      max-width: 100%;
      padding: 10px;
      border: 1px solid #e8e8e8;
    }

    .btn-submit {
      width: 120px;
      font-size: 14px;
      border-radius: 2px;
      color: white;
      background-color: $g-highlight;
      border-color: $g-highlight;
    }
  }
</style>
