<template>
  <layout-all class="my-info-wrap" :current-url="'my-user-info.html'">
    <el-form class="save-member-info" ref="editMobileForm" :model="editMobileForm" label-width="110px">
      <div class="info">
        <el-form-item label="账号：">
          <span>{{ memberInfo.unionid }}</span>
        </el-form-item>
        <!--<el-form-item label="微信昵称：">-->
        <!--<span>{{ memberInfo.name}}</span>-->
        <!--</el-form-item>-->
        <el-form-item label="姓名：">
          <el-input v-model="editMobileForm.name" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="QQ号：">
          <el-input v-model="editMobileForm.qq" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          {{ memberInfo.mobile || '暂无绑定手机号' }}
          <b class="edit-modile" @click="editMobile">{{ memberInfo.mobile === '' ? '新增' : '修改' }}</b>
        </el-form-item>
      </div>
      <div class="save">
        <el-button type="primary" @click="saveMemberInfo()">保存</el-button>
      </div>
    </el-form>

    <el-dialog
      custom-class="dialog-save-member-mobile"
      :visible.sync="showMobileDialog">
      <span slot="title">修改绑定手机号</span>
      <el-form ref="editMobileForm" :model="editMobileForm" :rules="editMobileRules" label-width="110px">
        <el-form-item label="原手机号：">
          <span>{{ memberInfo.mobile || '暂无绑定手机号' }}</span>
        </el-form-item>
        <el-form-item label="填写新的手机号：" prop="mobile">
          <el-input v-model="editMobileForm.mobile" style="width: 200px;" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="填写图片验证码：" prop="capcode">
          <el-input v-model="editMobileForm.capcode" style="width: 100px;"></el-input>
          <b class="pic-verify" @click="picVerify()"><img :src="`data:image/png;base64,${picVerifyCode.img}`"></b>
        </el-form-item>
        <el-form-item label="填写短信验证码：" prop="code">
          <el-input v-model="editMobileForm.code" style="width: 100px;" :maxlength="6"></el-input>
          <b class="msg-verify" v-if="!isCountDown" @click="msgVerify()">获取验证码</b>
          <b class="msg-verify" v-if="isCountDown">{{ setTime }}s</b>
        </el-form-item>
      </el-form>
      <template slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveMobile()">保 存</el-button>
      </template>
    </el-dialog>
  </layout-all>
</template>

<script>
  import memberInfo from 'api/member-info';
  import validate from '@/common/validate';
  import LayoutAll from '../my-layout/LayoutAll';
  import * as types from './../../store/mutation-types';

  const checkMobile = (rule, value, cb) => {
    validate.falsely(value, cb, '请输入手机号');
    validate.mobile(value, cb);
    cb();
  };
  const checkCapcode = (rule, value, cb) => {
    validate.falsely(value, cb, '请输入图片验证码');
    cb();
  };
  const checkCode = (rule, value, cb) => {
    validate.falsely(value, cb, '请输入短信验证码');
    cb();
  };

  export default {
    components: {
      LayoutAll,
    },

    data() {
      return {
        timer: null,
        memberInfo: [],
        showMobileDialog: false,
        picVerifyCode: [],
        editMobileForm: {
          name: '',
          qq: '',
          mobile: '',
          capcode: '',
          code: '',
        },
        editMobileRules: {
          mobile: [{ validator: checkMobile, trigger: 'blur' }],
          capcode: [{ validator: checkCapcode, trigger: 'blur' }],
        },
        setTime: 60,
        isCountDown: false,
      };
    },

    methods: {
      // 获取信息
      getMemberInfo(params) {
        memberInfo.getMemberInfo(params).then((data) => {
          this.memberInfo = data;
          this.editMobileForm = {
            ...this.editMobileForm,
            name: this.memberInfo && this.memberInfo.name,
            qq: this.memberInfo && this.memberInfo.qq,
          };
        });
      },

      // 修改
      editMobile() {
        this.showMobileDialog = true;
        // 避免编辑后再打开添加收货人时会进行地址必须校验
        if (this.$refs.editMobileForm) {
          this.$nextTick(() => {
            this.$refs.editMobileForm.resetFields();
          });
        }
      },

      // 获取图片验证码
      picVerify(params) {
        memberInfo.getPicVerify(params).then((data) => {
          this.picVerifyCode = data;
        });
      },

      // 获取短息验证码
      msgVerify() {
        this.$refs.editMobileForm.validate((valid) => {
          if (!valid) return;

          memberInfo.getMsgVerify(this.editMobileForm).then((data) => {
            this.isCountDown = true;
            clearInterval(this.timer);
            this.timer = setInterval(() => {
              this.setTime = this.setTime - 1;
              if (this.setTime === -1) {
                this.setTime = 0;
                clearInterval(this.timer);
                this.$message('请重新获取');
                this.isCountDown = false;
              }
            }, 1000);
            this.setTime = 60;
            console.log(5, data);
          }).catch((data) => {
            console.log(6, data);
            this.$message(data.errMsg);
          });
        });
      },

      // 修改手机号保存
      saveMobile() {
        this.editMobileRules = {
          ...this.editMobileRules,
          code: [{ validator: checkCode, trigger: 'blur' }],
        };
        this.$refs.editMobileForm.validate((valid) => {
          if (!valid) return;

          memberInfo.saveMobile(this.editMobileForm).then((data) => {
            this.$message('修改成功');
            this.showMobileDialog = false;
            window.location.reload();
            console.log(5, data);
          });
        });
      },

      // info保存
      saveMemberInfo() {
        memberInfo.saveMemberInfo(this.editMobileForm).then((data) => {
          this.$message('保存成功');
          console.log(4, data);
          const userInfo = JSON.parse(decodeURIComponent(this.$cookie.get('userInfo')));
          userInfo.name = this.editMobileForm.name;
          // this.$cookie.set('userInfo', encodeURIComponent(JSON.stringify(userInfo)));
          this.$cookie.set('userInfo', encodeURIComponent(JSON.stringify(userInfo)), { domain: window.HOSTNAME });
          this.$store.commit(types.USER_INFO);
        });
      },
    },

    created() {
      this.getMemberInfo();
      this.picVerify();
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  .my-info-wrap {
    $red: $g-highlight;

    .el-form-item {
      height: 30px;
      margin-bottom: 20px;

      .el-form-item__label {
        line-height: 30px;
        margin-right: 10px;
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

        b {
          display: inline-block;
          margin-left: 20px;
          font-style: normal;
          cursor: pointer;

          &.pic-verify {
            background: #efefef;
            width: 80px;
            height: 30px;
            img {
              width: 80px;
              height: 30px;
              vertical-align: middle;
            }
          }

          &.msg-verify {
            width: 78px;
            height: 22px;
            line-height: 24px;
            margin: 4px 0 4px 20px;
            border: 1px solid $red;
            border-radius: 2px;
            color: $red;
            text-align: center;
          }

          &.edit-modile {
            margin-left: 20px;
            font-size: 12px;
            color: #006de7;
            line-height: 30px;
            cursor: pointer;
          }
        }

        .el-form-item__error {
          margin-left: 10px;
        }
      }
    }

    .save-member-info {
      .info {
        padding: 30px 20px;
        background-color: white;
      }

      .save {
        margin-top: 20px;
        padding: 30px calc(50% - 75px) 20px;
        background: white;

        button {
          width: 150px;
          height: 40px;
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

    .dialog-save-member-mobile {
      font-size: 12px;
      color: #333333;
      line-height: 20px;

      &.el-dialog--small {
        width: 600px;
      }
    }
  }
</style>
