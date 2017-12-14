<template>
  <div class="page-cart">
    <layout-all>
      <div slot="site-header"></div>
      <div slot="shop-header"></div>
      <div slot="menu-bar"></div>
      <div slot="toolbar"></div>
      <div slot="page-content">
        <g-jx-logo :isShowLine="true">
          <div slot="left">我的购物车</div>
          <div slot="right">
            <div class="search">
              <div class="search-form">
                <!--<div class="search-all">
                  <input placeholder="服装开门红"/>
                  <div class="btn-search-all">搜本店</div>
                </div>-->
                <!--<div class="btn-search-site">搜本店</div>-->
              </div>
              <!--<div class="hotwords">
                <a href="" target="_blank">服装</a>
                <a href="" target="_blank">服装</a>
                <a href="" target="_blank">服装</a>
                <a href="" target="_blank">服装</a>
                <a href="" target="_blank">服装</a>
              </div>-->
            </div>
          </div>
        </g-jx-logo>
        <div class="g-line"></div>
        <div class="container cart-wrap" v-if="hasData">
          <div class="cart">
            <div class="cart-top g-clearfix">
              <div class="cart-top-left">
                <div class="cart-top-left-item-wrap">
                  <div class="cart-top-left-item">全部商品</div>
                  <div class="cart-top-left-item cart-top-left-item-number">{{allNum}}</div>
                </div>
              </div>
              <div class="cart-top-right">
                <div class="cart-top-right-item">已选择</div>
                <div class="cart-top-right-item c-highlight fb">{{allCheckedNum}}</div>
                <div class="cart-top-right-item">件商品</div>
                <!--<div class="cart-top-right-item c-dark fb ml20">已优惠：</div>
                <div class="cart-top-right-item c-dark">-</div>
                <div class="cart-top-right-item c-dark fb">￥</div>
                <div class="cart-top-right-item c-dark fb">120.00</div>
                <div class="cart-top-right-item">（不含运费）</div>-->
                <div class="cart-top-right-item c-dark ml20" style="margin-left: 17px;">总计：</div>
                <div class="cart-top-right-item c-highlight fb">￥</div>
                <div class="cart-top-right-item c-highlight fb">{{totalMoney}}</div>
                <div @click="mSettlement" class="cart-top-right-item-go-settlement ml20">去结算</div>
              </div>
            </div>
            <div class="cart-header cart-row">
              <div class="cart-col pl20" style="width: 113px;">
                <g-checkbox
                  :isChecked="isCheckedAll"
                  @change="mAllSelect()"
                  style="margin-top: 15px;">全选
                </g-checkbox>
              </div>
              <div class="cart-col" style="width: 514px;">商品信息</div>
              <div class="cart-col tr" style="width: 160px; padding-right: 60px;">单价</div>
              <div class="cart-col tc" style="width: 84px;">数量</div>
              <div class="cart-col tr" style="width: 170px; padding-right: 60px;">小计</div>
              <div class="cart-col tc">操作</div>
            </div>
            <div v-if="hasData" class="cart-body">
              <template v-for="(v,k,i) in shop">
                <div v-if="v.info.length" class="cart-body-main">
                  <div class="cart-body-title g-clearfix">
                    <g-checkbox
                      :isChecked="v.isCheckedAll"
                      @change="mAllSelectShop(v)"
                      class="fl pl20 f14 fb"><span>店家一号</span>
                    </g-checkbox>
                    <div style="color: #666666;" class="fr">共 {{allNumShop(v)}} 件</div>
                  </div>
                  <div
                    v-for="(conf, index) in v.config"
                    :class="{'cart-body-content-active':conf.isChecked}"
                    class="cart-body-content">
                    <div class="cart-body-product cart-row">
                      <div class="cart-col" style="width: 27px;">
                        <g-checkbox
                          :isChecked="conf.isChecked"
                          @change="mSingleSelect(conf, v.info[index], v)"></g-checkbox>
                      </div>
                      <div class="cart-col" style="width: 580px;">
                        <a target="_blank" :href="`detail.html?goods_id=${v.info[index].goods_id}`">
                          <div class="cart-product">
                            <div
                              :style="{backgroundImage:`url(${v.info[index].thumbnail_pic})`}"
                              class="cart-product-left"></div>
                            <div class="cart-product-center">{{v.info[index].name}}</div>
                            <div
                              @mouseenter="/*mMouseenter(conf, index)*/"
                              @mouseleave="/*mMouseleave(conf, index)*/"
                              :class="{'cart-product-right-active':conf.isShowModification}"
                              class="cart-product-right">
                              <div v-for="(v2, k2) in v.info[index].pdt_desc">{{k2}}：{{v2}}</div>
                              <div @click="mChange(conf)" class="cart-product-right-modification">修改</div>
                              <div
                                :class="{'cart-popover-show':conf.isShowPopover}"
                                class="cart-popover">
                                <div class="cart-popover-arrow">
                                  <div class="cart-popover-arrow-border"></div>
                                  <div class="cart-popover-arrow-content"></div>
                                </div>
                                <div class="cart-popover-wrap">
                                  <div class="cart-modification">
                                    <div class="cart-modification-left">
                                      <div class="cart-modification-item">
                                        <div class="cart-modification-title">颜色:</div>
                                        <div class="cart-modification-spec cart-modification-spec-img">
                                          <div
                                            :style="{backgroundImage:`url(${'http://p0.meituan.net/dpdeal/c4c2273d8752090853ed8f93ee2920fd70508.jpg%40640w_480h_1e_1c_1l%7Cwatermark%3D0?imageMogr2/thumbnail/185x185/strip/quality/90/'})`}"
                                            class="cart-modification-spec-item cart-modification-spec-item-active">
                                            <div class="tick"></div>
                                          </div>
                                          <div
                                            class="cart-modification-spec-item">
                                            <div class="tick"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="cart-modification-item">
                                        <div class="cart-modification-title">尺寸:</div>
                                        <div class="cart-modification-spec cart-modification-spec-txt">
                                          <div class="cart-modification-spec-item cart-modification-spec-item-active">
                                            40
                                            <div class="tick"></div>
                                          </div>
                                          <div class="cart-modification-spec-item">
                                            42
                                            <div class="tick"></div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="cart-modification-btn">
                                        <div @click="mConfirm(conf)" class="confirm">确定</div>
                                        <div @click="mCancel(conf)" class="cancel">取消</div>
                                      </div>
                                    </div>
                                    <div class="cart-modification-right">
                                      <div
                                        :style="{backgroundImage:`url(${'http://p0.meituan.net/dpdeal/c4c2273d8752090853ed8f93ee2920fd70508.jpg%40640w_480h_1e_1c_1l%7Cwatermark%3D0?imageMogr2/thumbnail/185x185/strip/quality/90/'})`}"
                                        class="cart-modification-img">
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div class="cart-col tr" style="width: 160px; padding-right: 60px;">
                        ¥ {{mNumDecimal(v.info[index].price)}}
                      </div>
                      <div class="cart-col" style="width: 84px;">
                        <div v-if="Number(v.info[index].store) !== 0 && v.info[index].marketable" class="cart-amount">
                        <span
                          @click="mReduce(conf, v.info[index], v.info[index].product_id, k)"
                          :class="{'cart-amount-item-disabled':!conf.isActiveReduce}"
                          class="iconfont icon-reduce cart-amount-item"></span>
                          <input
                            @blur="mBlur(conf, v.info[index], v.info[index].product_id, k, $event)"
                            class="cart-amount-input" :value="conf.num">
                          <span
                            @click="mPlus(conf, v.info[index], v.info[index].product_id, k)"
                            :class="{'cart-amount-item-disabled':!conf.isActivePlus}"
                            class="iconfont icon-plus cart-amount-item"></span>
                        </div>
                        <div style="text-align: center;margin-bottom: 10px;" v-else>1</div>
                        <div v-if="v.info[index].store" class="cart-have-store">库存：{{v.info[index].store}}</div>
                        <div v-else class="cart-no-store">库存不足</div>
                        <div v-if="!v.info[index].marketable" class="cart-no-store">非正常商品</div>
                      </div>
                      <div class="cart-col tr fb" style="width: 170px; padding-right: 60px;">
                        ¥ {{mNumDecimal(conf.num * v.info[index].price)}}
                      </div>
                      <div class="cart-col">
                        <div class="cart-product-opts">
                          <!--<div class="pb15">移入我的收藏</div>-->
                          <div @click="mDelete(v.config, v.info, index, v.info[index].product_id, k)">删除</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="cart-footer g-clearfix">
              <g-checkbox
                class="fl"
                :isChecked="isCheckedAll"
                @change="mAllSelect()"
                style="margin-top: 19px;color: #666666;">全选
              </g-checkbox>
              <div
                @click="mDeleteChecked"
                class="cart-footer-l fl pointer" style="margin-left: 35px;">删除选中商品
              </div>
              <!--<div class="cart-footer-l fl" style="margin-left: 35px;color: #666666;">移入收藏夹</div>-->
              <div class="cart-footer-r fr">
                <div class="item">已选择</div>
                <div class="item c-highlight fb">{{allCheckedNum}}</div>
                <div class="item">件商品</div>
                <!--<div class="item c-dark fb ml20">已优惠：</div>
                <div class="item c-dark">-</div>
                <div class="item c-dark fb">￥</div>
                <div class="item c-dark fb">120.00</div>
                <div class="item">（不含运费）</div>-->
                <div class="item c-dark ml20" style="margin-left: 17px;">总计：</div>
                <div class="item c-highlight fb f24">￥</div>
                <div class="item c-highlight fb f24">{{totalMoney}}</div>
                <div @click="mSettlement" class="go-settlement ml20">去结算</div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-data" v-else>
          <a href="index.html">
            <img src="~assets/images/cart/no-data.png"/>
            <p>购物车内暂时没有商品，快去添加吧！</p>
          </a>
        </div>
        <g-product-recommend :recType="4"></g-product-recommend>
      </div>
      <div style="display: none;">{{countCart}}</div>
    </layout-all>
  </div>
</template>

<script>
  import GJxLogo from '../common/GJxLogo';
  import GProductRecommend from '../common/GProductRecommend';
  import GCheckbox from '../../components/GCheckbox.vue';
  import LayoutAll from '../layout/LayoutAll';
  import SiteHeader from '../layout/SiteHeader';
  import cart from '../../api/carts';

  export default {
    data() {
      return {
        isCheckedAll: true, // 是否全选
        delAllCheckedFlag: true,
        shop: { // 多店铺
          /*
          84664: {
            timer: null, // 移入移出的定时器
            isCheckedAll: true, // 是否全选相关店铺的
            // 每项的当前配置
            config: [
              {
                delFlag: true,
                plusFlag: true,
                reduceFlag: true,
                blurFlag: true,
                isChecked: false, // 是否被选中
                allNum: 0, // 总共都少件数
                num: 1, // 当前数量
                oldValue: 1, // 老的数量
                isShowModification: false, // 是否显示修改
                isShowPopover: false, // 是否显示规格弹窗
                isActivePlus: false, // 是否可加
                isActiveReduce: false, // 是否可减
                step: 1, // 最小步长
              },
            ],
            // 购物车列表
            info: [
              {
                name: 'Timberland FlyRoam 男式高帮飞行潮靴更轻 更快 更自由 男式高帮飞行潮靴更轻2', // 名称
                price: '1200.01', // 价格
                store: 10, // 库存
                thumbnail_pic: '', // 商品图片
              },
            ],
          },
          */
        },
      };
    },
    methods: {
      // 确定
      mConfirm(v) {
        const value = v;
        value.isShowModification = false;
        value.isShowPopover = false;
      },
      // 取消
      mCancel(v) {
        const value = v;
        value.isShowModification = false;
        value.isShowPopover = false;
      },
      // 修改
      mChange(v) {
        const value = v;
        value.isShowPopover = true;
      },
      // 删除
      mDelete(conf, inf, index, productId, siteId) {
        const config = conf;
        const info = inf;
        if (config[index].delFlag) {
          config[index].delFlag = false;
          cart.del({
            type: 'del',
            data: [{
              site_id: siteId,
              p: [{ product_id: productId }],
            }],
          }).then(() => {
            config[index].delFlag = true;
            config.splice(index, 1);
            info.splice(index, 1);
          });
        }
      },
      // 删除选中的商品
      mDeleteChecked() {
        const arr = [];
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          const config = shop.config;
          const info = shop.info;
          const obj = {
            site_id: '',
            p: [],
          };
          for (let i = 0; i < config.length; i += 1) {
            if (config[i].isChecked) {
              obj.site_id = key;
              obj.p.push({ product_id: info[i].product_id });
            }
          }
          arr.push(obj);
        });
        if (this.delAllCheckedFlag) {
          this.delAllCheckedFlag = false;
          cart.del({
            type: 'del',
            // 这里只能传一个对象,如果是多店铺要传数组
            data: arr,
          }).then(() => {
            Object.keys(this.shop).forEach((key) => {
              const shop = this.shop[key];
              const config = shop.config;
              const info = shop.info;
              for (let i = 0; i < config.length; i += 1) {
                if (config[i].isChecked) {
                  config.splice(i, 1);
                  info.splice(i, 1);
                  i -= 1;
                }
              }
            });
            this.delAllCheckedFlag = false;
          });
        }
      },
      // 鼠标移入
      mMouseenter(v) {
        const value = v;
        value.timer = setTimeout(() => {
          value.isShowModification = true;
        }, 200);
      },
      // 鼠标移出
      mMouseleave(v) {
        const value = v;
        clearTimeout(value.timer);
        value.isShowModification = false;
        value.isShowPopover = false;
      },
      // 是否全选
      mIsSelectAll() {
        let isSelectAll = true;
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          const config = shop.config;
          Object.keys(config).forEach((key2) => {
            if (!config[key2].isChecked) {
              isSelectAll = false;
            }
          });
        });
        this.isCheckedAll = isSelectAll;
      },
      // 全选
      mAllSelect() {
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          const config = shop.config;
          const info = shop.info;
          this.isCheckedAll = !this.isCheckedAll;
          shop.isCheckedAll = this.isCheckedAll;
          Object.keys(config).forEach((key2, index2) => {
            if (info[index2].store && info[index2].marketable) {
              config[key2].isChecked = this.isCheckedAll;
            }
          });
        });
      },
      // 是否单店铺全选
      mIsSelectAllShop(v) {
        const value = v;
        let isSelectAll = true;
        value.config.forEach((v2) => {
          console.log(v2);
          if (!v2.isChecked) {
            isSelectAll = false;
          }
        });
        value.isCheckedAll = isSelectAll;
      },
      // 单店铺全选
      mAllSelectShop(v) {
        const value = v;
        value.isCheckedAll = !value.isCheckedAll;
        value.config.forEach((v2) => {
          const value2 = v2;
          value2.isChecked = value.isCheckedAll;
        });
        this.mIsSelectAll();// 是否全选
      },
      // 单选
      mSingleSelect(conf, inf, shop) {
        const config = conf;
        const info = inf;
        if (info.store && info.marketable) {
          config.isChecked = !config.isChecked;
        }
        this.mIsSelectAll(); // 是否全选
        this.mIsSelectAllShop(shop);// 是否单店铺全选
      },
      // 加
      mPlus(conf, inf, productId, siteId) {
        const config = conf;
        const info = inf;
        const result = config.num + config.step;
        if (result <= info.store) {
          if (config.plusFlag) {
            config.plusFlag = false;
            cart.del({
              type: 'up',
              data: [{
                site_id: siteId,
                p: [{
                  product_id: productId,
                  product_num: result,
                }],
              }],
            }).then(() => {
              config.num += config.step;
              config.oldValue = config.num;
              this.mPlusReduceStatus(result, info.store, config.step, config); // 加减状态
              config.plusFlag = true;
            });
          }
        }
      },
      // 失去焦点
      mBlur(conf, inf, productId, siteId, e) {
        const config = conf;
        const info = inf;
        config.num = Number(e.srcElement.value);
        let result = config.num;
        // 超过最大值
        if (result > info.store) {
          result = info.store;
        }
        // 小于最小值
        if (result < config.step) {
          result = config.step;
        }
        // 值符合步长
        if (result % config.step === 0) {
          // 加减在最大值和最小值之间
          if (result <= info.store && result >= config.step) {
            if (config.blurFlag) {
              config.blurFlag = false;
              cart.del({
                type: 'up',
                data: [{
                  site_id: siteId,
                  p: [{
                    product_id: productId,
                    product_num: result,
                  }],
                }],
              }).then(() => {
                config.num = result;
                config.oldValue = result;
                this.mPlusReduceStatus(result, info.store, config.step, config); // 加减状态
                config.blurFlag = true;
              });
            }
          }
        } else {
          config.num = config.oldValue;
        }
      },
      // 减
      mReduce(conf, inf, productId, siteId) {
        const config = conf;
        const info = inf;
        const result = config.num - config.step;
        if (result >= config.step) {
          if (config.reduceFlag) {
            config.reduceFlag = false;
            cart.del({
              type: 'up',
              // 这里只能传一个对象,如果是多店铺要传数组
              data: [{
                site_id: siteId,
                p: [{
                  product_id: productId,
                  product_num: result,
                }],
              }],
            }).then(() => {
              config.num -= config.step;
              config.oldValue = config.num;
              this.mPlusReduceStatus(result, info.store, config.step, config); // 加减状态
              config.reduceFlag = true;
            });
          }
        }
      },
      // 加减状态
      mPlusReduceStatus(num, max, min, conf) {
        const config = conf;
        config.isActiveReduce = num > min;
        config.isActivePlus = num < max;
        if (max === min) {
          config.isActiveReduce = false;
          config.isActivePlus = false;
        }
      },
      // 保留num位小数
      mNumDecimal(value, num = 2) {
        /* eslint-disable no-restricted-properties */
        const number = Math.pow(10, num);
        return (Math.floor(parseFloat(value) * number) / number).toFixed(2);
      },
      // 去结算
      mSettlement() {
        if (this.allCheckedNum) {
          localStorage.cartListInfo = this.cartListInfo;
          location.href = 'order.html?source=cart';
        }
      },
      // 单店铺商品数量
      allNumShop(v) {
        const value = v;
        let num = 0;
        value.config.forEach((v2) => {
          if (v2.isChecked) {
            num += v2.num;
          }
        });
        return num;
      },
    },
    computed: {
      countCart() {
        const shop = {};
        const getCartsList = JSON.parse(JSON.stringify(this.$store.state.getCartsList));
        if (!getCartsList.site_id) {
          return shop;
        }
        shop[getCartsList.site_id] = {
          carts: getCartsList,
        };
        Object.keys(shop).forEach((key) => {
          const config = [];
          let info = [];
          info = shop[key].carts.product;
          Object.keys(info).forEach((key2) => {
            const value = info[key2];
            const number = value.nums;
            config.push({
              delFlag: true,
              plusFlag: true,
              reduceFlag: true,
              blurFlag: true,
              isChecked: Boolean(value.store && value.marketable), // 是否被选中
              num: number, // 当前数量
              oldValue: number, // 老的数量
              isShowModification: false, // 是否显示修改
              isShowPopover: false, // 是否显示规格弹窗
              isActivePlus: false, // 是否可加
              isActiveReduce: false, // 是否可减
              step: 1, // 最小步长
            });
          });
          this.$set(this.shop, key, {
            timer: null, // 移入移出的定时器
            isCheckedAll: true, // 是否全选
            allNum: 0, // 总共都少件数
            config, // 配置
            info, // 数据
          });
        });
        return this.shop;
      },
      // 商品总数量
      allNum() {
        let length = 0;
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          Object.keys(shop.config).forEach((key2) => {
            const nowConfig = shop.config[key2];
            if (nowConfig.isChecked) {
              length += nowConfig.num;
            }
          });
        });
        return length;
      },
      hasData() {
        let hasData = false;
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          if (shop.info.length) {
            hasData = true;
          }
        });
        return hasData;
      },
      // 被选中的商品的数量
      allCheckedNum() {
        let allCheckedNum = 0;
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          const config = shop.config;
          Object.keys(config).forEach((key2) => {
            if (config[key2].isChecked) {
              allCheckedNum += config[key2].num;
            }
          });
        });
        return allCheckedNum;
      },
      // 总价
      totalMoney() {
        let totalMoney = 0;
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          const config = shop.config;
          const info = shop.info;
          Object.keys(config).forEach((key2, index2) => {
            if (config[key2].isChecked) {
              totalMoney += config[key2].num * info[index2].price;
            }
          });
        });
        return this.mNumDecimal(totalMoney);
      },
      // 购物车列表数据
      cartListInfo() {
        const shopListData = [];
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          const info = shop.info;
          const config = shop.config;
          const obj = {};
          obj.site_id = key;
          obj.product = [];
          Object.keys(info).forEach((key2, index2) => {
            const nowInfo = info[key2];
            const nowConfig = config[index2];
            if (nowConfig.isChecked) {
              const obj2 = {
                product_id: nowInfo.product_id,
                product_num: nowConfig.num,
              };
              obj.product.push(obj2);
            }
          });
          shopListData.push(obj);
        });
        return JSON.stringify(shopListData);
      },
    },
    watch: {
      shop() {
        Object.keys(this.shop).forEach((key) => {
          const shop = this.shop[key];
          const config = shop.config;
          const info = shop.info;
          // 加减按钮的状态
          Object.keys(config).forEach((key2, index2) => {
            const nowConfig = config[key2];
            const nowInfo = info[index2];
            this.mPlusReduceStatus(
              nowConfig.num,
              nowInfo.store,
              nowConfig.step,
              nowConfig,
            );
          });
        });
      },
    },
    components: {
      GCheckbox,
      LayoutAll,
      GProductRecommend,
      GJxLogo,
      SiteHeader,
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";
  @import "../../styles/variables";

  .no-data {
    padding: 45px 0;
    text-align: center;
    font-size: 18px;
    color: #888888;
    img {
      display: block;
      margin: 0 auto 40px;
    }
  }

  .cart-footer {
    $height: 50px;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    border: 1px solid #e8e8e8;
    background: #f6f6f6;
    padding-left: 20px;
    color: #aaaaaa;
    .cart-footer-r {
      position: relative;
      font-size: 14px;
      padding-right: 110px;
      .item {
        display: inline-block;
        vertical-align: top;
      }
      .go-settlement {
        cursor: pointer;
        font-size: 20px;
        position: absolute;
        right: -1px;
        top: -1px;
        width: 100px;
        height: 100%;
        line-height: $height;
        text-align: center;
        color: #ffffff;
        background: $g-highlight;
      }
    }
    .cart-footer-l {
      color: #666666;
      &:hover {
        color: $g-highlight;
      }
    }
  }

  .tick {
    position: absolute;
    right: 0;
    bottom: 0;
    display: block;
    width: 12px;
    height: 12px;
    background: url("~assets/images/detail/tick.png") no-repeat center;
  }

  .cart-popover {
    display: none;
    background: #ffffff;
    position: absolute;
    left: 0;
    top: 100px;
    z-index: 10;
    .cart-popover-arrow {
      position: absolute;
      left: 26px;
      top: -5px;
      z-index: 8;
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
      background: inherit;
      border-top: 1px solid #e8e8e8;
      border-left: 1px solid #e8e8e8;
    }
    .cart-popover-wrap {
      position: relative;
      z-index: 5;
      border: 1px solid #e8e8e8;
      background: inherit;
    }
    &.cart-popover-show {
      display: block;
    }
  }

  .cart-modification {
    @include clearfix;
    width: 494px;
    .cart-modification-left {
      float: left;
      width: 294px;
      padding-top: 20px;
      padding-left: 20px;
      box-sizing: border-box;
      .cart-modification-item {
        @include clearfix();
        .cart-modification-title {
          font-size: 12px;
          color: #888888;
          float: left;
          width: 52px;
          overflow: hidden;
        }
        .cart-modification-spec {
          float: left;
          .cart-modification-spec-item {
            float: left;
            position: relative;
            margin-right: 10px;
            margin-bottom: 10px;
            .tick {
              display: none;
            }
            &.cart-modification-spec-item-active {
              .tick {
                display: block;
              }
            }
          }
          &.cart-modification-spec-img {
            .cart-modification-spec-item {
              width: 34px;
              height: 34px;
              box-sizing: border-box;
              border: 1px solid #dddddd;
              background: center center no-repeat;
              background-size: cover;
              position: relative;
            }
          }
          &.cart-modification-spec-txt {
            .cart-modification-spec-item {
              padding: 0 14px;
              height: 19px;
              line-height: 19px;
              text-align: center;
              box-sizing: border-box;
              border: 1px solid #dddddd;
            }
          }
        }
      }
      .cart-modification-btn {
        margin-left: 50px;
        margin-top: 10px;
        @include clearfix;
        cursor: pointer;
        .confirm {
          float: left;
          width: 54px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: $g-highlight;
          color: #ffffff;
          border-radius: 4px;
        }
        .cancel {
          float: left;
          width: 54px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #888888;
        }
      }
    }
    .cart-modification-right {
      float: right;
      width: 200px;
      height: 200px;
      padding: 8px;
      box-sizing: border-box;
      border-left: 1px solid #e8e8e8;
      .cart-modification-img {
        width: 100%;
        height: 100%;
        background: center center no-repeat;
        background-size: cover;
      }
    }
  }

  .cart-wrap {
    margin-bottom: 40px;
    line-height: 1;
  }

  .cart-amount {
    $height: 22px;
    display: inline-block;
    height: $height;
    font-size: 0;
    line-height: $height;
    text-align: center;
    vertical-align: top;
    @include clearfix;
    .cart-amount-item {
      cursor: pointer;
      box-sizing: border-box;
      float: left;
      width: $height;
      height: 100%;
      font-size: 12px;
      line-height: $height;
      color: #000000;
      text-align: center;
      border: 1px solid #e3e3e3;
      background: #eeeeee;
      &.cart-amount-item-disabled {
        color: #aaaaaa;
      }
    }
    .cart-amount-input {
      box-sizing: border-box;
      float: left;
      width: 40px;
      height: 100%;
      font-size: 12px;
      color: #888888;
      text-align: center;
      background: white;
      border: none;
      border-top: 1px solid #e3e3e3;
      border-bottom: 1px solid #e3e3e3;
    }
  }

  .c-dark {
    color: #333333;
  }

  .c-highlight {
    color: $g-highlight;
  }

  .cart-row {
    @include clearfix;
    display: table;
    width: 100%;
  }

  .cart-col {
    display: table-cell;
    position: relative;
    box-sizing: border-box;
    float: left;
    height: 100%;
  }

  .cart-have-store {
    font-size: 12px;
    line-height: 24px;
    color: #666666;
    text-align: center;
  }

  .cart-no-store {
    font-size: 12px;
    line-height: 24px;
    color: $g-highlight;
    text-align: center;
  }

  .cart-product {
    @include clearfix;
    .cart-product-left {
      float: left;
      width: 80px;
      height: 80px;
      background: #cccccc center center no-repeat;
      background-size: cover;
    }
    .cart-product-center {
      float: left;
      width: 314px;
      margin-left: 14px;
      font-size: 12px;
      line-height: 20px;
      color: #333333;
    }
    .cart-product-right {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      width: 160px;
      height: 100%;
      padding-top: 10px;
      padding-left: 20px;
      font-size: 12px;
      line-height: 20px;
      color: #888888;
      border: 1px dashed transparent;
      .cart-product-right-modification {
        position: absolute;
        top: -1px;
        right: -1px;
        display: none;
        width: 24px;
        height: 18px;
        padding: 2px 4px;
        line-height: 18px;
        color: white;
        cursor: pointer;
        text-align: center;
      }
      &:hover {
        /*
        border-color: #d7d7d7;
        .cart-product-right-modification {
          display: block;
          background: #d7d7d7;
        }
        */
      }
      &.cart-product-right-active {
        background: #ffffff;
        border-color: $g-highlight;
        .cart-product-right-modification {
          display: block;
          background: $g-highlight;
        }
      }
    }
  }

  .cart-body {
    margin-bottom: 30px;
    .cart-body-main {
      .cart-body-title {
        padding-top: 20px;
        padding-bottom: 14px;
        line-height: 1;
        border-left: 1px solid transparent;
        border-bottom: 1px solid $g-highlight;
      }
    }
    .cart-body-content {
      box-sizing: border-box;
      border: 1px solid #e8e8e8;
      border-top: none;
      .cart-col {
        padding-top: 12px;
        padding-bottom: 24px;
      }
      .cart-body-product {
        padding-left: 20px;
        .cart-product-opts {
          top: 0;
          right: 0;
          height: 100%;
          color: #888888;
          cursor: pointer;
        }
        &.cart-body-product-active {
          background: #fff4e9;
        }
      }
      &.cart-body-content-active {
        background: #fff4e9;
      }
    }
  }

  .cart-header {
    box-sizing: border-box;
    height: 42px;
    font-size: 12px;
    line-height: 42px;
    color: #666666;
    background: #f6f6f6;
    border: 1px solid #e8e8e8;
  }

  .cart-top {
    $height: 50px;
    box-sizing: border-box;
    height: $height;
    line-height: $height;

    .cart-top-left {
      float: left;

      .cart-top-left-item-wrap {
        box-sizing: border-box;
        height: $height;
        border-bottom: 2px solid $g-highlight;

        .cart-top-left-item {
          display: inline-block;
          font-size: 16px;
          font-weight: bold;
          color: $g-highlight;

          &.cart-top-left-item-number {
            margin-left: 10px;
          }
        }
      }
    }

    .cart-top-right {
      float: right;
      color: #aaaaaa;

      .cart-top-right-item {
        display: inline-block;
        font-size: 14px;
        line-height: 1;
      }

      .cart-top-right-item-go-settlement {
        cursor: pointer;
        display: inline-block;
        width: 70px;
        height: 36px;
        font-size: 14px;
        line-height: 36px;
        color: white;
        text-align: center;
        background: $g-highlight;
      }
    }
  }

  .search {
    .search-form {
      display: inline-block;
      font-size: 0;

      .search-all {
        display: inline-block;
        margin-right: 2px;
        border: 2px solid $g-highlight;
      }

      input {
        display: inline-block;
        width: 298px;
        height: 21px;
        padding: 5px;
        overflow: hidden;
        font-size: 12px;
        vertical-align: middle;
        border: 0;
      }

      .btn-search-all {
        display: inline-block;
        height: 31px;
        padding: 0 14px;
        font-size: 14px;
        line-height: 31px;
        color: white;
        vertical-align: middle;
        cursor: pointer;
        background: $g-highlight;
      }

      .btn-search-site {
        display: inline-block;
        width: 70px;
        height: 36px;
        font-size: 14px;
        line-height: 36px;
        color: white;
        text-align: center;
        cursor: pointer;
        background: #282724;
      }
    }

    .hotwords {
      padding-top: 4px;
      line-height: 20px;

      a {
        color: #888888;
      }
    }
  }
</style>
