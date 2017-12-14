<template>
  <div>
    <layout-all>
      <template slot="site-header"></template>
      <template slot="shop-header"></template>
      <template slot="menu-bar"></template>
      <div slot="page-content">
        <g-jx-logo :isShowLine="true">
          <template slot="left">购物车结算</template>
          <div slot="right" class="step-wrapper">
            <steps :space="150" :active="2" align-center finish-status="success">
              <step title="我的购物车"></step>
              <step title="填写核对订单信息"></step>
              <step title="成功提交订单"></step>
              <step title="成功支付"></step>
            </steps>
          </div>
        </g-jx-logo>
        <div class="g-line"></div>

        <div class="container order-wrapper">
          <div class="">
            <div class="header">
              收货人信息
              <a href="javascript:;" class="add-address" @click="addAddress">新增收货地址</a>
            </div>
            <div class="content">
              <ul class="address-list" :style="shipStyle" v-if="orderInfo.shipping && orderInfo.shipping.length">
                <li v-for="(item, index) in orderInfo.shipping">
                  <el-button
                    class="tick address-btn"
                    @click="selectShip(index)"
                    :class="{selected: selectedShip.id === item.id}">{{item.ship_name}} {{item.province}}
                  </el-button>
                  <div class="address-item">
                    <span class="name">{{item.ship_name}}</span>
                    <span class="address">{{item.province}}  {{item.city}}  {{item.region}}  {{item.address}}</span>
                    <span class="mobile">{{item.ship_mobile}}</span>
                    <span class="badge" v-if="item.default==='true'">默认</span>
                  </div>
                  <div class="address-op">
                    <a href="javascript:;" v-if="item.default!=='true'" @click="setDefaultAddress(item.id)">设为默认</a>
                    <a href="javascript:;" @click="editAddress(item)">编辑</a>
                    <a href="javascript:;" v-if="item.default!=='true'" @click="removeAddress(item.id)">删除</a>
                  </div>
                </li>
              </ul>
              <a href="javascript:;" @click="getMoreAddress()"
                 v-if="!shipMoreLoaded || (orderInfo.shipping && orderInfo.shipping.length)">
                {{ shipFold ? '更多地址' : '收起更多'}}
                <i class="iconfont" :class="[shipFold ? 'icon-angle-double-down': 'icon-angle-double-up']"></i>
              </a>
              <p v-else class="text-muted">暂无收货人地址</p>
            </div>
          </div>
          <el-dialog
            custom-class="dialog-address"
            :close-on-click-modal="false"
            :visible.sync="showShipDialog">
            <span slot="title">{{ this.shipForm.id ? '编辑' : '添加' }}收货地址</span>
            <el-form ref="shipForm" :model="shipForm" :rules="shipRules" label-width="80px">
              <el-form-item label="收货人" prop="ship_name">
                <el-input v-model="shipForm.ship_name" style="width: 50%;" :maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="ship_mobile">
                <el-input v-model="shipForm.ship_mobile" style="width: 50%;"></el-input>
              </el-form-item>
              <el-form-item label="所在地区" prop="region_id" v-loading="regionLoading">
                <el-select v-model="shipForm.province_id" placeholder="省" @change="provinceChanged">
                  <el-option v-for="item in provinceList"
                             :key="item.region_id"
                             :label="item.region_name"
                             :value="item.region_id"></el-option>
                </el-select>
                <el-select v-model="shipForm.city_id" placeholder="市" @change="cityChanged">
                  <el-option v-for="item in cityList"
                             :key="item.region_id"
                             :label="item.region_name"
                             :value="item.region_id"></el-option>
                </el-select>
                <el-select v-model="shipForm.region_id" placeholder="区">
                  <el-option v-for="item in regionList"
                             :key="item.region_id"
                             :label="item.region_name"
                             :value="item.region_id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="shipForm.address" :maxlength="50"></el-input>
              </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
              <el-button @click="showShipDialog = false">取 消</el-button>
              <el-button type="primary" @click="addressSubmit">保 存</el-button>
            </template>
          </el-dialog>

          <div>
            <div class="header">支付方式</div>
            <div class="content">
              <el-radio-group v-model="orderForm.payment" class="radio-group-split tick">
                <el-radio-button
                  v-for="item in orderInfo.payment_list"
                  :key="item.pay_type"
                  :label="item.pay_type">{{ item.pay_name }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div>
            <div class="header">订单信息</div>
            <div class="content order-info">
              <div class="header-table-wrapper">
                <table class="table">
                  <thead>
                    <tr>
                      <th class="prod-info">商品信息</th>
                      <th class="prod-attr">商品属性</th>
                      <th class="price">单价</th>
                      <th class="amount">数量</th>
                      <!--<th class="discount-way">优惠方式</th>-->
                      <th>小计</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div class="table-box" v-for="(item, key) in orderInfo.orders" :key="item.id">
                <p class="check">{{item.store_info && item.store_info.store_name}}</p>
                <table class="table table-bordered">
                  <tbody>
                    <tr v-for="product in item.product" :key="product.goods_id">
                      <td class="prod-info">
                        <img :src="product.thumbnail_pic" :alt="product.name">
                        <p class="title">{{ product.name }}</p>
                      </td>
                      <td class="prod-attr">
                        <p v-if="typeof product.pdt_desc === 'string'">{{ product.pdt_desc }}</p>
                        <p v-else v-for="(classify, title) in product.pdt_desc">{{ title }}：{{ classify }}</p>
                      </td>
                      <td class="price">￥ {{ product.price | money}}</td>
                      <td class="amount">x{{ product.nums }}</td>
                      <!--<td class="discount-way">
                        &lt;!&ndash;<p>
                          <span class="tag">会员折扣</span>
                          百大品牌领券满199减60，满499减150，仅限一天！
                        </p>
                        <p>
                          <span class="tag">满减送</span>
                          全场满99元减5元
                        </p>&ndash;&gt;
                      </td>-->
                      <td class="total">￥ {{ product.price * product.nums | money}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="box-inner-section">
                  <p class="title">收货方式</p>
                  <div>
                    <el-radio-group v-model="item.delivery_type" class="radio-group-split tick">
                      <el-radio-button
                        label="common"
                        :disabled="item.just_store==1">
                        普通快递
                      </el-radio-button>
                      <el-radio-button
                        label="store"
                        :disabled="!item.muiltstore_list || !item.muiltstore_list.length || item.certId_status==1">
                        门店自提
                      </el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
                <!-- 仅选择自提门店时展示 -->
                <div class="box-inner-section picked-up" v-if="item.delivery_type==='store'">
                  <p class="title">自提门店</p>
                  <a href="javascript:;" class="ui-button tick store-btn" v-if="selectedSE.store_name">
                    {{ selectedSE.store_name}}</a>
                  <a href="javascript:;" @click="showSEDialog=true"
                     v-if="item.muiltstore_list && item.muiltstore_list.length">{{selectedSE ? '修改' : '选择'}}</a>
                  <p v-else class="tips">无可选门店</p>
                  <p class="tips">提示：选择门店自提，支付成功后可凭提货码在门店扫码提货</p>
                </div>

                <div class="box-inner-section" v-if="item.certId_status==1">
                  <p class="title">身份证号码</p>
                  <input class="cert-id" v-model="orderForm.orderDentity[item.product[0].site_id]"></input>
                  <p class="tips">提示：因跨境交易需要，请填写正确的身份信息</p>
                </div>

                <div class="box-inner-section">
                  <p class="title">给商家留言</p>
                  <textarea v-model="orderForm.orderMessage[item.product[0].site_id]" maxlength="150"></textarea>
                  <span class="count-prompt">
                    {{orderForm.orderMessage[item.product[0].site_id].length}}/150</span>
                </div>

                <div class="box-footer g-clearfix">
                  <p>
                    商品总计：
                    <span class="item-total">￥{{ item.goods_final_amount | money }}</span>
                  </p>
                  <p>运费：
                    <span class="freightage">
                      ￥{{ (selectedSE && item.delivery_type === 'store') ? 0 : item.cost_freight | money }}
                    </span>
                  </p>
                  <p>优惠：
                    <span class="freightage">
                      ￥{{ item.pmt_amount | money }}
                    </span>
                  </p>
                </div>

                <el-dialog
                  class="dialog-select-store"
                  :close-on-click-modal="false"
                  :visible.sync="showSEDialog">
                  <span slot="title">选择自提门店</span>
                  <div class="left-content">自提门店：</div>
                  <div class="right-content" v-if="item.muiltstore_list">
                    <div class="store-wrap">
                      <div v-for="(item, index) in item.muiltstore_list"
                           v-if="(isShowSEMore && index > 3) || index <= 3">
                        <el-button class="tick"
                                   @click="handleSEClick(item)"
                                   :class="{selected: selectedSE.store_id === item.store_id}">{{ item.store_name }}
                        </el-button>
                        <p class="address">地址：{{item.store_addr}}</p>
                        <p class="mobile">电话：{{item.store_phone}}</p>
                      </div>
                    </div>

                    <a href="javascript:;" class="show-more"
                       @click="showSEMore" v-if="item.muiltstore_list.length > 4">
                      {{ isShowSEMore ? '收起更多' : '展开更多' }} ></a>
                  </div>
                  <template slot="footer" class="dialog-footer">
                    <el-button @click="unSelectedSE(item)">取 消</el-button>
                    <el-button type="primary" @click="showSEDialog = false">保 存</el-button>
                  </template>
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
        <div class="container order-footer">
          <div class="content">
            <p>
              （优惠 <span class="discount">￥{{ totalPmtAmount | money }}</span> 不含运费）
              <span class="total-title">应付总计：</span><span class="total">￥{{ finalAmount | money }}</span>
            </p>
            <p>
              <template v-if="selectedShip">
                <span class="address">寄送至：
                  {{selectedShip.province}}  {{selectedShip.city}}  {{selectedShip.region}}  {{selectedShip.address}}
                </span>
                <span class="consignee">收货人：{{selectedShip.ship_name}} {{selectedShip.ship_mobile}}</span>
              </template>
              <template v-else>请选择寄送地址</template>
            </p>
          </div>

          <el-button type="primary" class="submit-btn" @click="submitOrder"
                     :disabled="!selectedShip" :loading="submitLoading">提交订单
          </el-button>
        </div>
      </div>
    </layout-all>
  </div>
</template>

<script>
  import { Steps, Step } from 'components/step';
  import number from 'api/number';
  import store from 'api/store';
  import order from 'api/order';
  import carts from 'api/carts';
  import { getQueryParams } from 'utils/queryStr';
  import { goBack } from 'utils/common';
  import loginHelper from 'utils/loginHelper';
  import validate from '@/common/validate';
  import { INIT_ADDRESS_FORM } from '@/common/consts';
  import LayoutAll from '../layout/LayoutAll';
  import GJxLogo from '../common/GJxLogo';

  const DELIVERY_COMMON = 'common';
  const DELIVERY_STORE = 'store';

  const queryParams = getQueryParams();

  // TODO: 模块化此页功能
  export default {
    components: {
      LayoutAll,
      GJxLogo,
      Steps,
      Step,
    },

    computed: {
      shipStyle() {
        if (this.shipFold) {
          return {
            height: '45px',
            overflow: 'hidden',
          };
        }
        return {};
      },
      // 应付总计 = 总金额 + 总运费 - 总优惠
      finalAmount() {
        let totalAmount = 0; // 总金额
        let totalCostFreight = 0; // 总运费
        let totalPmtAmount = 0; // 总优惠
        if (!this.orderInfo || !this.orderInfo.orders) return 0;

        Object.keys(this.orderInfo.orders).forEach((siteId) => {
          const site = this.orderInfo.orders[siteId];
          // 商品金额之和
          totalAmount += (+site.goods_final_amount || 0);
          // 自提不需要付运费
          if (site.delivery_type === DELIVERY_COMMON) {
            totalCostFreight += (+site.cost_freight || 0);
          }
          // 优惠金额之和
          totalPmtAmount += (+site.pmt_amount || 0);
        });

        this.totalPmtAmount = totalPmtAmount;
        return (totalAmount + totalCostFreight) - totalPmtAmount;
      },
    },

    data() {
      const checkMobile = (rule, value, cb) => {
        validate.falsely(value, cb, '请输入手机号');
        validate.mobile(value, cb);
        cb();
      };

      return {
        showShipDialog: false, // 是否打开收货人编辑/添加弹窗
        provinceList: [],
        cityList: [],
        regionList: [],
        regionLoading: false, // 区域加载提示
        shipForm: { ...INIT_ADDRESS_FORM }, // 收货人表单对象
        shipMoreLoaded: false, // 用于只加载一次收货人列表
        shipFold: true, // 展开/收起更多地址
        selectedShip: '', // 选中的收货人
        shipRules: { // 收货人表单验证规则
          ship_name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
          ship_mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' },
          ],
          region_id: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
        },
        showSEDialog: false, // 是否打开弹窗
        isShowSEMore: false, // 自提弹窗，是否展示更多
        selectedSE: '', // 选中的自提位置
        orderInfo: '',
        orderForm: {
          payment: '', // 支付方式
        },
        totalPmtAmount: 0, // 总优惠
        submitMsg: '', // $message实例，用于提示订单创建信息
        submitLoading: false, // 提交按钮加载状态
      };
    },

    methods: {
      // 加载省市区列表
      getRegion(regionId) {
        return store.getRegionList({ region_id: regionId });
      },
      // 获取收货人列表
      getAddressList(addressId, firstLoad) {
        number.getAddressList({ address_id: addressId }).then(({ data }) => {
          if (firstLoad) {
            this.orderInfo.shipping = [...this.orderInfo.shipping, ...data];
            this.shipMoreLoaded = true;
          } else {
            this.orderInfo.shipping = data;
          }
        });
      },
      // 设置默认地址
      setDefaultAddress(id) {
        number.setDefaultAddress(id).then(() => {
          this.getAddressList();
        });
      },
      // 加载更多收货人地址
      getMoreAddress() {
        this.shipFold = !this.shipFold;

        // 已加载则不再加载
        if (this.shipMoreLoaded) return;

        this.getAddressList(this.selectedShip.id, true);
      },
      // 选择收货人地址
      selectShip(index) {
        this.selectedShip = this.orderInfo.shipping[index];
        this.fetchOrderData({ address_id: this.selectedShip.id });
      },
      // 添加收货人地址
      addAddress() {
        this.shipForm = { ...INIT_ADDRESS_FORM };
        this.showShipDialog = true;

        // 清除之前选中项
        this.cityList = [];
        this.regionList = [];

        // 若无省列表，则重新请求
        if (!(this.provinceList && this.provinceList.length)) {
          this.getRegion().then((data) => {
            this.provinceList = data;
          });
        }

        // 避免编辑后再打开添加收货人时会进行地址必须校验
        if (this.$refs.shipForm) {
          this.$nextTick(() => {
            this.$refs.shipForm.resetFields();
          });
        }
      },
      // 编辑收货人地址
      editAddress(item) {
        this.showShipDialog = true;
        this.regionLoading = true;
        if (!(this.provinceList && this.provinceList.length)) {
          this.getRegion().then((data) => {
            this.provinceList = data;
          });
        }

        const {
          id,
          ship_name,
          ship_mobile,
          province_id,
          city_id,
          region_id,
          address,
        } = item;

        this.shipForm = {
          id,
          ship_name,
          ship_mobile,
          province_id,
          address,
        };

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
      // 添加、编辑收货人
      addressSubmit() {
        this.$refs.shipForm.validate((valid) => {
          if (!valid) return;

          this.showShipDialog = false;
          number.addOrUpdateAddress(this.shipForm).then((data) => {
            this.shipForm = { ...INIT_ADDRESS_FORM };
            this.fetchOrderData({ address_id: data.id });
          });
        });
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
        console.log(val);

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
      // 删除收货人
      removeAddress(id) {
        this.$confirm('您确定要删除该收货地址吗？', '删除收货人信息').then(() => {
          number.removeAddress(id).then(() => {
            this.fetchOrderData();
          });
        }).catch(() => {
        });
      },
      // 自提：选择门店
      handleSEClick(item) {
        this.selectedSE = item;
      },
      // 自提：展开/收起更多门店
      showSEMore() {
        this.isShowSEMore = !this.isShowSEMore;
      },
      // 自提：取消选择
      unSelectedSE(item) {
        this.selectedSE = item.muiltstore_list[0];
        this.showSEDialog = false;
      },
      // 获取查询参数（详情从url拿，购物车页从localStore拿）TODO 统一参数获取方式
      getParams() {
        const { product: orderParams, source } = queryParams;
        if (!source || ['detail', 'cart'].indexOf(source) === -1) {
          history.back();
        }

        let sites;
        if (source === 'detail') {
          sites = JSON.parse(decodeURIComponent(orderParams || '[]'));
        } else if (source === 'cart') {
          sites = carts.getCartListInfo();
        }

        if (!sites.length) {
          history.back();
          return {};
        }

        // TODO 兼容多站点
        const site = sites[0];
        const { site_id, product } = site;
        const goods = JSON.stringify({ [site_id]: product });

        let deliveryType;
        if (this.orderForm.deliveryType === DELIVERY_STORE) {
          deliveryType = JSON.stringify({
            [site_id]: [{
              delivery_type: 'store',
              store_id: this.selectedSE.store_id,
            }],
          });
        }

        return {
          goods,
          site_id,
          delivery_type: deliveryType,
          order_source: 'jxpc',
        };
      },
      fetchOrderData(params) {
        this.shipMoreLoaded = false;
        this.shipFold = true;

        order.checkout({
          ...this.getParams(),
          ...params,
        }).then((data) => {
          this.initData(data);
          this.orderInfo = data;
        }).catch(err => this.$message({
          message: err.errMsg,
          onClose: () => window.history.back(),
        }));
      },
      // 初始化数据
      initData(data) {
        if (!data.orders) return;

        Object.keys(data.orders).forEach((siteId) => {
          // NOTE: ① 避免地址更新后把之前填写的数据清掉
          if (!this.orderForm.orderMessage) {
            this.$set(this.orderForm, 'orderMessage', {
              [siteId]: '',
            });
          }
          if (!this.orderForm.orderDentity) {
            this.$set(this.orderForm, 'orderDentity', {
              [siteId]: '',
            });
          }

          // 单店铺
          // 默认选中第一个门店
          if (data.orders[siteId].muiltstore_list && data.orders[siteId].muiltstore_list.length) {
            // NOTE: ①
            if (!this.selectedSE) {
              this.selectedSE = data.orders[siteId].muiltstore_list[0];
            }
          }

          // 默认选中第一个收货人
          if (data.shipping.length) {
            this.selectedShip = data.shipping[0];
          } else {
            this.selectedShip = '';
          }

          // NOTE: ①
          if (this.orderInfo && this.orderInfo.orders) {
            data.orders[siteId].delivery_type = this.orderInfo.orders[siteId].delivery_type; // eslint-disable-line
          }
        });

        // 支付方式：默认微信放第一位并选中
        const sortable = [];
        Object.keys(data.payment_list).forEach(key => sortable.push(data.payment_list[key]));
        data.payment_list = sortable.sort((a, b) => b.pay_type - a.pay_type); // eslint-disable-line
        if (data.payment_list && data.payment_list[0]) {
          // NOTE: ①
          if (!this.orderForm.payment) {
            this.orderForm.payment = data.payment_list[0].pay_type;
          }
        }
      },
      // 提交订单
      submitOrder() {
        if (!this.selectedShip) return;

        const site = [];
        Object.keys(this.orderInfo.orders).forEach((siteId) => {
          const {
            cost_freight,
            final_amount,
            product,
            delivery_type,
          } = this.orderInfo.orders[siteId];

          const orderInfo = {
            site_id: siteId,
            cost_freight,
            final_amount,
            product,
            delivery_type,
            coupon_id: 0,
            product_count: product.length,
            act_id: 0,
            use_score_off: false,
            memo: this.orderForm.orderMessage[siteId],
            dentity: this.orderForm.orderDentity[siteId],
          };

          // 门店自提
          if (this.selectedSE && orderInfo.delivery_type === DELIVERY_STORE) {
            const {
              store_name: storeName,
              store_phone: storePhone,
              store_id: storeId,
            } = this.selectedSE;
            orderInfo.store_name = storeName;
            orderInfo.store_phone = storePhone;
            orderInfo.store_id = storeId;
          }

          site.push(orderInfo);
        });

        const result = {
          cost_freight: 0, // 自已算
          final_amount: this.orderInfo.final_amount,
          payment: JSON.stringify({ id: this.orderForm.payment }),
          product_count: 0, // 自已算
          order_source: this.orderInfo.order_source,
          consignee_id: this.selectedShip.id,
          site: JSON.stringify(site),
          source: queryParams.source,
        };

        let count = 0;
        const self = this;
        const DEFAULT_FAIL_MSG = '下单失败';

        // 订单确认
        function orderConfirm(taskId) {
          return order.confirm({ task_id: taskId }).then((data) => {
            const { order_id: orderId, status } = data;
            count += 1;

            if (status === 'success') {
              document.location.href = `pay.html?order_id=${orderId}&pay_type=${self.orderForm.payment}`;
              return;
            }

            // 每隔3秒，最多请求5次
            if (count < 5) {
              setTimeout(() => {
                orderConfirm(taskId);
              }, 3000);
            } else if (status !== 'success') { // 超过5次订单确认仍不成功，不再执行
              self.submitMsg.message = DEFAULT_FAIL_MSG;
              self.submitMsg.showClose = true;
              self.submitLoading = false;
            }
          }).catch((res) => {
            self.submitMsg.message = res.errMsg || DEFAULT_FAIL_MSG;
            self.submitMsg.showClose = true;
            self.submitLoading = false;
          });
        }

        this.submitMsg = this.$message({
          message: '正在生成订单，请稍后...',
          duration: 0,
          showClose: false,
        });
        this.submitLoading = true;

        // 创建订单
        order.add(result).then(({ task_id: taskId }) => {
          if (taskId) orderConfirm(taskId);
        }).catch((res) => {
          this.submitMsg.message = res.errMsg || DEFAULT_FAIL_MSG;
          this.submitMsg.showClose = true;
          this.submitLoading = false;
        });
      },
      preValidate() {
        if (!loginHelper.isLogin()) {
          window.document.location.href = 'login.html';
        }

        const { goods, site_id } = this.getParams();
        if (!goods || !site_id) { // eslint-disable-line
          goBack();
        }
      },
    },

    created() {
      this.preValidate();

      this.fetchOrderData();
    },
  };
</script>

<style lang="scss">
  @import "../../styles/mixins";
  @import "../../styles/variables";

  .order-wrapper,
  .order-footer {
    &,
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
  }

  // 进度条
  .step-wrapper {
    height: 40px;

    .ui-step__title {
      font-size: 12px;
    }

    .ui-step:last-child {
      width: 40px !important;

      .ui-step__main {
        margin-left: -16px !important;
      }
    }
  }

  // 下订单主体
  .order-wrapper {
    // min-height: 990px;
    padding: 20px;
    margin-top: 20px;
    border: 1px solid #e8e8e8;

    a:not(.ui-button) {
      color: #5b95ce;
    }

    .el-button.tick {
      width: 150px;
      height: 30px;
      padding: 0 15px;
    }

    .header {
      padding: 0;
      font-size: 14px;

      .add-address {
        float: right;
        font-size: 12px;
      }
    }

    .content {
      padding: 20px 10px;

      &.order-info {
        padding-top: 0;
        margin-top: -10px;
      }

      .address-list {
        max-height: 45px * 5;
        overflow-y: auto;

        li {
          height: 30px;
          margin-bottom: 15px;

          &:hover {
            background-color: #feefed;

            .address-op {
              display: inline-block;
            }
          }

          .address-btn {
            span {
              @include ellipsis2(1, 30px);
            }
          }

          .address-item,
          .address-op {
            display: inline-block;
            line-height: 30px;
          }

          .address-op {
            display: none;
          }

          .address-item {
            color: #888888;

            .name,
            .address,
            .mobile,
            .badge {
              margin-left: 20px;
            }

            .badge {
              padding: 2px 4px;
              color: white;
              background-color: #fa7d50;
              border-radius: 3px;
            }
          }

          .address-op {
            float: right;
            margin-left: 20px;

            > a {
              padding: 0 10px;
            }
          }
        }
      }

      .table {
        th {
          text-align: center;
          border-top: none;
        }

        td,
        th {
          &.prod-info {
            width: 300px;
          }

          &.prod-attr {
            width: 135px;
            text-align: left;
          }

          &.price {
            width: 110px;
            text-align: center;
          }

          &.amount {
            width: 70px;
            text-align: center;
          }

          &.discount-way {
            width: 350px;
            text-align: left;
          }

          &.total {
            font-weight: bold;
            font-size: 14px;
            color: black !important;
          }
        }
      }

      .header-table-wrapper {
        padding: 0 20px;
        border-bottom: 3px solid #e8e8e8;

        .table thead th {
          color: #888888;
          border-bottom: none;
        }
      }

      .table-box {
        padding: 30px 20px 15px;
        margin-top: 20px;
        box-shadow: 0 0 15px 2px #e8e8e8;

        .box-inner-section {
          margin-top: 20px;

          .title {
            margin-bottom: 10px;
          }

          .ui-button {
            margin-right: 20px;
          }

          .el-button {
            width: 150px;
            height: 30px;
            padding: 0 15px;
            margin-right: 10px;
          }

          .el-radio-button__inner {
            width: 150px;
            height: 30px;
            padding: 0 15px;
            margin-right: 30px;
            line-height: 30px;
          }

          .cert-id {
            width: 330px;
            height: 30px;
          }

          textarea {
            width: 600px;
            height: 80px;
            padding: 10px;
            border: 1px solid #e8e8e8;
          }

          .count-prompt {
            margin-left: 10px;
            color: #aaaaaa;
            vertical-align: text-bottom;
          }

          .tips {
            margin-top: 5px;
            color: #aaaaaa;
          }
        }

        .picked-up {
          .ui-button {
            width: 400px;
            color: #666666;

            &.store-btn {
              text-align: left;
              padding-left: 10px;
            }
          }
        }

        .check {
          height: 15px;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: bold;
          line-height: 15px;
          color: #666666;

          input[type=checkbox] {
            width: 15px;
            height: 15px;
          }
        }

        .box-footer {
          padding-top: 15px;
          margin-top: 15px;
          font-size: 14px;
          border-top: 1px solid #dddddd;

          p {
            float: right;
            clear: both;
          }

          .text-muted {
            color: #888888;
          }

          .freightage,
          .item-total {
            display: inline-block;
            width: 145px;
            color: $g-highlight;
            text-align: right;
          }

          .item-total {
            font-size: 22px;
          }
        }

        .table {
          tr {
            min-height: 100px;
          }

          td {
            padding: 10px;
            color: #888888;

            &:last-child {
              text-align: center;
            }

            &.prod-info {
              position: relative;
            }

            &.discount-way {
              p {
                margin-bottom: 10px;
              }
            }
          }

          .tag {
            padding: 1px 4px;
            color: white;
            background-color: #fa7d50;
            border-radius: 4px;
          }

          img {
            width: 68px;
            height: 68px;
            margin-top: 6px;
            margin-left: 10px;
          }

          .title {
            position: absolute;
            top: 4px;
            display: inline-block;
            width: 195px;
            padding-left: 10px;
            vertical-align: top;
            color: #333333;

            @include multi-line-ellipsis($lineHeight: 1.5em, $lineCount: 4, $bgColor: white);
          }
        }
      }
    }

    .dialog-address {
      &.el-dialog--small {
        width: 750px;
      }

      .el-form-item__label {
        color: #888888;
      }
    }
  }

  // 选择门店 - 弹窗样式
  .dialog-select-store {
    .el-dialog {
      width: 650px;

      .el-dialog__body {
        color: #888888;
      }

      .el-dialog__footer {
        padding: 10px 20px 40px;
      }

      .left-content {
        display: inline-block;
        width: 120px;
        text-align: right;
        vertical-align: top;
      }

      .right-content {
        display: inline-block;

        .store-wrap {
          max-height: 91px * 4;
          padding-right: 15px;
          overflow-y: scroll;
        }

        .el-button {
          width: 400px;
          height: 30px;
          padding: 0 10px;
          font-size: 12px;
          color: #666666;
          text-align: left;

          > span {
            @include ellipsis2(1, 30px);
          }
        }

        .address,
        .mobile {
          margin-top: 5px;
          font-size: 12px;
        }

        .mobile {
          margin-bottom: 15px;
        }

        .show-more {
          font-size: 12px;
        }
      }
    }
  }

  // 下单统计
  .order-footer {
    height: 145px;
    margin-top: 20px;
    margin-bottom: 47px;

    .content {
      height: 90px;
      padding-right: 52px;
      padding-bottom: 17px;
      background-color: #f6f6f6;
      border: 1px solid #e8e8e8;

      p {
        float: right;
        clear: both;
        font-size: 14px;
        color: #888888;

        &:first-child {
          padding-top: 5px;
          padding-bottom: 10px;
        }

        .discount {
          font-weight: bold;
          color: $g-highlight;
        }

        .total-title {
          color: #333333;
        }

        .total {
          margin-left: 30px;
          font-size: 26px;
          font-weight: bold;
          color: $g-highlight;
        }

        .consignee {
          padding-left: 16px;
        }
      }
    }

    .submit-btn {
      float: right;
      min-width: 140px;
      height: 45px;
      padding: 6px 30px;
      margin-top: 10px;
      margin-right: 50px;
      font-size: 20px;
      color: white;
      background-color: $g-highlight;
    }
  }

  .dialog-submit {
    &.el-dialog--small {
      width: 350px;
    }

    p {
      text-align: center;
    }
  }
</style>
