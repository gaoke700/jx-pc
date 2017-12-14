<template>
  <layout-all class="my-address-wrap" :current-url="'my-address.html'">
    <div class="address">
      <div class="address-btn">
        <button @click="showAddress">新增收货地址</button>
        <span>您已创建<i>{{ addressList.length }}</i>个收货地址，最多可创建<i>20</i>个</span>
      </div>
      <div class="address-list-wrap" v-if="addressList.length > 0">
        <div class="address-list" v-for="item in addressList">
          <header><b>{{ item.ship_name }}</b><span v-if="item.default === 'true'">默认地址</span></header>
          <div class="info-list">
            <label>收货人：</label>
            <span>{{ item.ship_name }}</span>
          </div>
          <div class="info-list">
            <label>所在地区：</label>
            <span>{{ item.province }}{{ item.city }}{{ item.region }}</span>
          </div>
          <div class="info-list">
            <label>地址：</label>
            <span>{{ item.address }}</span>
          </div>
          <div class="info-list">
            <label>手机：</label>
            <span>{{ item.ship_mobile }}</span>
          </div>
          <div class="set">
            <span v-if="item.default !== 'true'" @click="setDefaultAddress(item.id)">设为默认地址</span>
            <span @click="editAddress(item)">编辑</span>
            <span v-if="item.default !== 'true'" @click="removeAddress(item.id)">删除</span>
          </div>
        </div>
      </div>
      <div class="ui-no-data" v-else>
        <img src="~assets/images/my/address/no-address.png"/>
        <p class="ui-no-data-text">您还没有地址，赶快添加吧</p>
      </div>
      <address-dialog :options="shipForm" :visible.sync="showShipDialog" @onSuccess="onSuccess"></address-dialog>
    </div>
  </layout-all>
</template>

<script>
  import number from 'api/number';
  import store from 'api/store';
  import { INIT_ADDRESS_FORM } from '@/common/consts';
  import AddressDialog from '../common/AddressDialog';
  import LayoutAll from '../my-layout/LayoutAll';

  export default {
    components: {
      LayoutAll,
      AddressDialog,
    },

    data() {
      return {
        addressList: [],
        showShipDialog: false, // 是否打开弹窗
        shipForm: { // 地址表单对象
          id: '',
          ...INIT_ADDRESS_FORM,
        },
      };
    },

    methods: {
      // 加载省市区列表
      getRegion(regionId) {
        return store.getRegionList({ region_id: regionId });
      },

      // 获取地址list
      getAddressList(params) {
        number.getAddressList(params).then(({ data }) => {
          this.addressList = data;
        });
      },

      // 新增
      showAddress() {
        this.showShipDialog = true;
        this.shipForm = {
          ...INIT_ADDRESS_FORM,
        };
      },

      // 编辑
      editAddress(item) {
        this.showShipDialog = true;

        this.shipForm = {
          id: item.id,
          ship_name: item.ship_name,
          ship_mobile: item.ship_mobile,
          province_id: item.province_id,
          city_id: item.city_id,
          region_id: item.region_id,
          address: item.address,
        };
      },

      // 设为默认地址
      setDefaultAddress(id) {
        number.setDefaultAddress(id).then(() => {
          this.getAddressList();
          this.$message('设置成功');
        });
      },

      // 删除
      removeAddress(id) {
        this.$confirm('您确定要删除该收货地址吗？', '删除收货人信息').then(() => {
          number.removeAddress(id).then(() => {
            this.$message('删除成功');
            this.getAddressList();
          });
        }).catch(() => {});
      },

      onSuccess({ id }) {
        this.$message(`${id ? '编辑' : '添加'}成功`);
        this.getAddressList();
      },
    },

    created() {
      this.getAddressList();
      this.getRegion();
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  .my-address-wrap {
    .address {
      padding: 20px;
      background: white;

      .address-btn {
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;

        button {
          width: 110px;
          height: 30px;
          border: 0;
          border-radius: 2px;
          background: $g-highlight;
          font-size: 14px;
          color: #ffffff;
          text-align: center;
          cursor: pointer;
        }

        span {
          display: inline-block;
          margin-left: 15px;
          font-size: 12px;
          color: #888888;
          letter-spacing: 0;
          text-align: center;

          i {
            color: $g-highlight;
          }
        }
      }

      .address-list {
        position: relative;
        padding: 10px;
        border: 1px solid #dddddd;
        margin-bottom: 10px;

        header {
          line-height: 20px;
          font-size: 14px;
          color: #333333;
          margin-bottom: 10px;
          span {
            display: inline-block;
            margin-left: 10px;
            background: #fcbc07;
            width: 60px;
            height: 20px;
            font-size: 12px;
            color: #ffffff;
            text-align: center;
            cursor: pointer;
          }
        }

        .info-list {
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          color: #333333;

          label {
            display: inline-block;
            width: 60px;
            line-height: 24px;
            margin-right: 15px;
            text-align: right;
          }
        }

        .set {
          position: absolute;
          bottom: 10px;
          right: 10px;
          z-index: 2;

          span {
            margin-left: 20px;
            font-size: 13px;
            color: #006de7;
            text-align: right;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
