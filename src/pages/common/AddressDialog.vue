<template>
  <el-dialog custom-class="dialog-address" :close-on-click-modal="false" :visible.sync="innerVisible" @close="close">
    <span slot="title">{{ shipForm.ship_name ? '编辑' : '添加' }}收货地址</span>
    <el-form ref="shipForm" :model="shipForm" :rules="shipRules" label-width="80px">
      <el-form-item label="收货人" prop="ship_name">
        <el-input v-model="shipForm.ship_name" style="width: 50%;" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="ship_mobile">
        <el-input v-model="shipForm.ship_mobile" style="width: 50%;"></el-input>
      </el-form-item>
      <el-form-item label="所在地区" prop="region_id" v-loading="regionLoading">
        <el-select v-model="shipForm.province_id" placeholder="省" @change="provinceChanged">
          <el-option v-for="item in provinceList" :key="item.region_id" :label="item.region_name"
                     :value="item.region_id"></el-option>
        </el-select>
        <el-select v-model="shipForm.city_id" placeholder="市" @change="cityChanged">
          <el-option v-for="item in cityList" :key="item.region_id" :label="item.region_name"
                     :value="item.region_id"></el-option>
        </el-select>
        <el-select v-model="shipForm.region_id" placeholder="区">
          <el-option v-for="item in regionList" :key="item.region_id" :label="item.region_name"
                     :value="item.region_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="shipForm.address" :maxlength="50"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = false">取 消</el-button>
      <el-button type="primary" @click="addressSubmit">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import ApiStore from 'api/store';
  import ApiNumber from 'api/number';
  import validate from '@/common/validate';
  import { INIT_ADDRESS_FORM } from '@/common/consts';

  export default {
    props: {
      options: {
        type: Object,
        default: () => ({}),
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      const mobileRule = (rule, value, cb) => {
        validate.falsely(value, cb, '请输入手机号');
        validate.mobile(value, cb);
        cb();
      };

      return {
        // 区域加载提示
        regionLoading: false,
        // 是否打开收货人编辑/添加弹窗
        innerVisible: this.visible,
        shipForm: {},
        // 收货人表单验证规则
        shipRules: {
          ship_name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
          ship_mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: mobileRule, trigger: 'blur' },
          ],
          region_id: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
        },
        provinceList: [],
        cityList: [],
        regionList: [],
      };
    },

    methods: {
      close() {
        this.$emit('update:visible', false);
        this.$emit('close');
      },
      showFn(val) {
        this.innerVisible = val;
        this.shipForm = {
          ...INIT_ADDRESS_FORM,
          ...this.options,
        };

        // 清除之前选中项
        this.cityList = [];
        this.regionList = [];

        // 若无省列表，则重新请求
        if (!(this.provinceList && this.provinceList.length)) {
          this.getRegion().then((data) => {
            this.provinceList = data;
          });
        }

        this.resetFields();

        const {
          province_id,
          city_id,
          region_id,
        } = this.shipForm;

        if (!province_id) return; // eslint-disable-line

        // 省市区回显
        this.getRegion(province_id).then((data) => {
          this.cityList = data;
          this.regionList = [];

          this.getRegion(city_id).then((region) => {
            this.regionList = region;

            this.shipForm = {
              ...this.shipForm,
              city_id,
              region_id,
            };

            this.regionLoading = false;
          });
        });
      },
      addressSubmit() {
        this.$refs.shipForm.validate((valid) => {
          if (!valid) return;
          ApiNumber.addOrUpdateAddress(this.shipForm).then(() => {
            this.innerVisible = false;
            this.$emit('onSuccess', { id: this.shipForm.id });
          });
        });
      },
      // 加载省市区列表
      getRegion(regionId) {
        return ApiStore.getRegionList({ region_id: regionId });
      },
      provinceChanged(val) {
        if (!val) return;

        this.shipForm.city_id = '';
        this.shipForm.region_id = '';
        this.cityList = [];
        this.regionList = [];

        this.regionLoading = true;
        this.getRegion(val).then((data) => {
          this.regionLoading = false;
          this.cityList = data;
        });
      },
      cityChanged(val) {
        if (!val) return;

        this.regionLoading = true;
        this.getRegion(val).then((data) => {
          this.regionLoading = false;
          this.regionList = data;

          // 手动切换市时，清空之前选中的区
          if (this.shipForm.region_id && !this.regionList.filter(item => item.region_id === this.shipForm.region_id).length) {
            this.shipForm.region_id = '';
          }
        });
      },
      resetFields() {
        // 避免编辑后再打开添加收货人时会进行地址必须校验
        if (this.$refs.shipForm) {
          this.$refs.shipForm.resetFields();
        }
      },
    },
    watch: {
      visible(val) {
        if (val) {
          this.$emit('open');
          this.showFn(val);
        } else {
          this.$emit('close');
        }
      },
    },
  };
</script>

<style lang="scss">
  .dialog-address {
    &.el-dialog--small {
      width: 750px;
    }

    .el-form-item__label {
      color: #888888;
    }
  }
</style>
