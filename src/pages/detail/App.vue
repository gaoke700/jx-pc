<template>
  <div class="page-detail">
    <layout-all>
      <div slot="page-content">
        <!--
                <div class="bread-crumbs">
                  <div class="text">
                    <template v-for="item in navItem">
                      <a :href="item.url">{{item.text}}</a><span>></span>
                    </template>
                  </div>
                </div>
        -->
        <div class="content">
          <div class="contant-data" v-if="marketable && (productInfo && productInfo.goods_store !== 0)">
            <div class="product-intro">
              <div class="preview-wrap">
                <magnifier v-if="productInfo.img && productInfo.img.length" :items="productInfo.img"></magnifier>
              </div>

              <div class="item-info-wrap">
                <p class="name">{{ productInfo.title }}</p>
                <template>
                  <div class="summary mb10">
                    <div class="item-hd price-item">
                      <div class="dt">销售价：</div>
                      <div class="dd"><p class="price">￥<span>{{ selectedProd.price }}</span></p></div>
                    </div>

                    <div
                      v-if="Boolean(promotion && Object.keys(promotion).length)"
                      class="item-hd sales-promotion-item">
                      <div class="dt">促&#x3000;销：</div>
                      <div class="dd">
                        <p v-if="promotion.minus_money_arr">
                          <span>满减送</span>
                          <template v-for="v in promotion.minus_money_arr">
                            满{{v.conf}}减{{v.favourable}}；
                          </template>
                        </p>
                        <p v-if="promotion.coupon_arr">
                          <span>优惠券</span>
                          <template v-for="v in promotion.coupon_arr">
                            满{{v.conf}}送{{v.coupon}}元优惠券；
                          </template>
                        </p>
                        <p v-if="promotion.pinkage_arr">
                          <span>包邮</span>
                          满{{promotion.pinkage_arr}}元包邮；
                        </p>
                        <p v-if="promotion.score_arr">
                          <span>积分</span>
                          <template v-for="v in promotion.score_arr">
                            满{{v.conf}}送{{v.score}}积分；
                          </template>
                        </p>
                        <p v-if="promotion.paygift">
                          <span>支付有礼</span>
                          <template v-if="promotion.paygift.payed != 0">
                            满{{promotion.paygift.payed}}元送礼；
                          </template>
                          <template v-else>
                            支付有奖；
                          </template>
                          {# if params.paygift.payed ~= 0 then #}<i>{# echo(params.paygift.payed) #}</i>元送礼{# else #}支付有奖{# end #}
                        </p>
                      </div>
                    </div>

                    <!--
                    <div class="item-hd coupons-item">
                      <div class="dt">优惠卷：</div>
                      <div class="dd">
                        <ul class="coupons">
                          <li>
                            <span></span>
                            <span>现金50元抵用卷</span>
                            <span></span>
                          </li>
                          <li>
                            <span></span>
                            <span>现金50元抵用卷</span>
                            <span></span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    -->
                  </div>

                  <div class="choose-attrs">
                    <div class="item-hd pt10 classify" v-for="(item, index) in this.productInfo.classify_list"
                         :key="index">
                      <div class="dt">{{item.title}}：</div>
                      <div class="dd">
                        <div class="choose-attrs-list-wrap">
                          <template v-for="attr in item.list">
                            <div
                              :class="{
                              active: (attr.id == selectedAttr[index]),
                              inactive: mIsDisable(attr.id, index)
                            }"
                              :data-id="attr.id"
                              @click="specBtnClick(attr.id, index)"
                              class="choose-attrs-item">
                              <div class="tick"></div>
                              <img
                                v-if="attr.img_src && item.type==='image'"
                                :src="attr.img_src"
                                :alt="attr.text">
                              <span class="label">{{attr.text}}</span>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <div class="item-hd pt10">
                      <div class="dt">数&#x3000;量：</div>
                      <div class="dd">
                        <input-number v-model="amount" :min="1" :max="store"></input-number>
                      </div>
                      <div class="dd page-store">
                        <span v-if="store">库存：{{store}}</span>
                        <span v-else class="page-store-no">本商品暂无库存</span>
                      </div>
                    </div>
                  </div>

                  <div class="choose-btns">
                    <a href="javascript:;" class="btn ui-btn js-page-lijigoumai"
                       :class="{
                      disabled:store <= 0
                    }" @click="buyNow">立即购买</a>
                    <a href="javascript:;" class="btn ui-btn" :class="{
                      'ui-btn-color1': store > 0,
                      disabled:store <= 0
                    }" @click="addCart">加入购物车</a>
                    <p class="js-page-shoucang" @click="goodsCollect"><i class="iconfont" :class="{  'icon-star' : (this.productInfo.fav_status === 0), 'icon-star-fill' : this.productInfo.fav_status === 1 }"></i>收藏商品</p>
                    <!--
                                    <p>举报</p>
                    -->

                  </div>
                </template>
              </div>
            </div>
            <div class="g-clearfix">
              <div class="fl w200">
                <div class="border1" v-if=" treeList.length > 0 ">
                  <div class="title f14 fb">
                    <span class="tag-line ib mr5 ml10 vm"></span> <span>全部商品分类</span>
                  </div>
                  <div>
                    <tree v-for="(value,index) in treeList" :key="index" isJump :info="value"></tree>
                  </div>
                </div>
                <div class="border1 mt10" v-if="recommendList.length > 0">
                  <div class="title f14 fb">
                    <span class="tag-line ib mr5 ml10 vm"></span><span>店铺推荐</span>
                  </div>
                  <div>
                    <a :href="'detail.html?goods_id='+value.goods_id" class="p10 g-clearfix block border-top"
                       v-for="value in recommendList">
                      <img :src="value.thumbnail_pic" class="w50 h50 border1 fl" alt="商品图片"/>
                      <div class="goods-name pt5 pl10 pr10 fr w120">{{value.name}}</div>
                    </a>
                  </div>
                </div>
              </div>
              <div class="product-detail ml20 fr block">
                <div class="tab-main">
                  <ul>
                    <li v-for="(item, index) in tab.item" :class="{ 'active': (index == tab.index) }"
                        @click="changeTab(index)">{{item.text}}
                    </li>
                  </ul>
                </div>
                <div class="tab-con">
                  <li v-for="(item, index) in tab.item" :style="{ 'display': (index == tab.index ? 'block' : 'none') }">
                    <component :is="item.view" :goodsId="goodsId" :isShow="(index == tab.index ? true : false)"></component>
                  </li>
                </div>
              </div>
            </div>
          </div>
          <div class="ui-no-data" v-else>
            <img src="~assets/images/detail/no-detail.png"/>
            <p class="ui-no-data-text">抱歉！商品已下架或无库存</p>
            <p class="ui-no-data-target"><a href="index.html">返回首页</a></p>
          </div>
        </div>
        <notification :options="options" :show="showNotification" @close="closeNotification"></notification>
      </div>
    </layout-all>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import goodsApi from 'api/goods';
  import storeApi from 'api/store';
  import recommend from 'api/recommend';
  import memberCollect from 'api/member-collect';
  import { getQueryParams } from 'utils/queryStr';
  import Magnifier from 'components/Magnifier';
  import InputNumber from 'components/InputNumber';
  import Message from 'components/message';
  import LayoutAll from '../layout/LayoutAll';
  import Comments from './Comments';
  import ProductInfo from './ProductInfo';
  import Utils from '../../utils/utils';
  import ApiCarts from '../../api/carts';
  import loginHelper from '../../utils/loginHelper';
  import Tree from '../common/Tree';
  import { goBack } from '../../utils/common';

  export default {
    components: {
      LayoutAll,
      Comments,
      ProductInfo,
      Magnifier,
      InputNumber,
      Tree,
    },
    data() {
      return {
        goodsId: '',
        selectedOldAttr: [], // ['102', '103']    选中了谁
        selectedAttr: [], // ['102', '103']    选中了谁
        disabledMap: [], // [[], [], ['102', '103']]  谁不能被选
        treeList: [],
        recommendList: [],
        store: 0,
        productInfo: {},
        selectedProd: {},
        promotion: {}, // 满减规则
        marketable: true, // true正常  false下架
        amount: 1,
        navItem: [
          { text: '首页', url: 'df' },
          { text: 'Timberland', url: 'adf' },
          { text: '礼品箱包', url: 'asdf' },
          { text: '功能箱包', url: 'asdf' },
          { text: 'T恤', url: 'adsf' },
          { text: 'Timberland', url: 'asdf' },
          { text: '男款树形LOGO印花短袖T恤', url: 'adf' },
        ],
        tab: {
          item: [
            { text: '商品详情', view: 'ProductInfo' },
            { text: '评论', view: 'Comments' },
          ],
          index: 0,
        },
        showNotification: false,
        options: {
          time: 2000,
          content: '成功加入购物车',
        },
      };
    },
    methods: {
      changeTab(index) {
        this.tab.index = index;
      },
      specBtnClick(id, index) {
        if (this.mIsDisable(id, index)) { // 被禁止的不能点击
          return;
        }
        if (id === this.selectedOldAttr[index]) {
          this.$set(this.selectedAttr, index, '-1');
          this.$set(this.selectedOldAttr, index, '-1');
        } else {
          this.$set(this.selectedAttr, index, id);
          this.$set(this.selectedOldAttr, index, id);
        }
        this.disabledSelect();
      },
      closeNotification() {
        this.showNotification = false;
      },
      addCart() {
        const index = Utils.arrayFindkey(this.productInfo.product, 'search_id', this.selectedAttr.join('-'));
        const checkProductInfo = this.productInfo.product[index];
        if (checkProductInfo) {
          ApiCarts.add({
            data: {
              site_id: this.productInfo.site_id,
              carts: [
                { product_id: checkProductInfo.pid, product_num: this.amount },
              ],
            },
          }).then(() => {
            this.showNotification = true;
            this.getCartsList();
          }).catch(error => Message(error.errMsg));
        } else {
          this.$message('请选择规格');
        }
      },
      ...mapActions(['getCartsList']),
      buyNow() {
        if (!loginHelper.isLogin()) {
          window.location.href = 'login.html';
          return;
        }

        if (this.selectSpecLen === this.specLen) {
          const params = [{
            site_id: this.productInfo.site_id,
            product: [{
              product_id: this.selectedProd.pid,
              product_num: this.amount,
            }],
          }];

          window.location.href = `order.html?source=detail&product=${encodeURIComponent(JSON.stringify(params))}`;
        } else {
          this.$message('请选择规格');
        }
      },
      // 面包屑
      crumbs() {
        this.navItem.length = 0;
        (this.productInfo.path || []).forEach((v) => {
          this.navItem.push(v);
        });
      },
      // 默认选中
      defaultSelect() {
        let defaultSelect = [];
        this.productInfo.product.forEach((v) => {
          if (v.defaultselect && Number(v.store)) {
            this.selectedProd = v;
            defaultSelect = v.search_id && v.search_id.split('-');
          }
        });
        defaultSelect.forEach((v, i) => {
          console.log(4, v, i, this.productInfo.classify_list[i].list);
          this.productInfo.classify_list[i].list.forEach((v2) => {
            if (Number(v2.id) === Number(v)) {
              this.selectedAttr[i] = v;
              this.selectedOldAttr[i] = v;
            }
          });
        });
        this.disabledSelect();
        /*
        console.log('this.productInfo:', this.productInfo);
        console.log('this.selectedAttr:', this.selectedAttr);
        console.log('this.selectedProd:', this.selectedProd);
        console.log('this.disabledMap:', this.disabledMap);
        */
      },
      // 根据选中的推理出哪些不能被选中的
      disabledSelect() {
        const disabledMap = this.disabledMap;
        disabledMap.length = 0;
        for (let j = 0; j < this.specLen; j += 1) {
          disabledMap.push([]);
        }
        const product = this.productInfo.product; // 规格排列好的可能性
        const goodsStoreIsZero = Number(this.productInfo.goods_store) === 0;
        if (goodsStoreIsZero) {
          // 总库存为0的情况下,谁都不可以被选
          this.productInfo.classify_list.forEach((v, i) => {
            this.disabledMap[i].push(v.list.map(v2 => v2.id));
          });
          this.selectedProd = product[0];
        } else {
          // 总库存不为0,的情况下,没有库存的不可以被选
          const selectedAttr = this.selectedAttr;
          // console.log('选中了:', selectedAttr);
          // console.log('规格的长度:', this.specLen);
          // console.log('规格排列好的可能性:', product);
          // console.log('被选中的长度:', this.selectSpecLen);
          // 只剩一项的时候进行判断
          if (this.selectSpecLen === this.specLen - 1) {
            console.log('只剩一项规格没被选中了');
            const index = selectedAttr.indexOf('-1'); // 剩下那一项的索引
            if (index !== -1) {
              this.productInfo.classify_list[index].list.forEach((v) => {
                const arr = selectedAttr.slice(0);
                arr.splice(index, 1, v.id);
                const lastMay = arr.join('-');
                product.forEach((v2) => {
                  if (v2.search_id === lastMay && !Number(v2.store)) {
                    disabledMap[index].push(v.id);
                  }
                });
              });
            }
          }
          // 全选的时候进行判断
          if (this.selectSpecLen === this.specLen) {
            console.log('每项规格都被选中了');
            selectedAttr.forEach((v, i) => {
              const arr = selectedAttr.slice(0);
              this.productInfo.classify_list[i].list.forEach((v2) => {
                arr.splice(i, 1, v2.id);
                product.forEach((v3) => {
                  if (v3.search_id === arr.join('-') && !Number(v3.store)) {
                    disabledMap[i].push(v2.id);
                  }
                });
              });
            });
            // 选了谁
            product.forEach((v) => {
              if (v.search_id === selectedAttr.join('-')) {
                this.selectedProd = v;
                this.store = +v.store;
                this.amount = 1;
              }
            });
          }
        }
      },
      // 判断规格按钮是不是禁用状态
      mIsDisable(id, index) {
        let isDisable = false;
        (this.disabledMap[index] || []).forEach((v) => {
          if (Number(id) === Number(v)) {
            isDisable = true;
          }
        });
        return isDisable;
      },
      // 商品收藏
      goodsCollect() {
        if (!loginHelper.isLogin()) {
          window.location.href = 'login.html';
          return;
        }
        memberCollect.updateCollect({
          site_id: this.productInfo.site_id,
          goods_id: this.goodsId,
          status: this.productInfo.fav_status === 0 ? 1 : 2,
        }).then((data) => {
          if (this.productInfo.fav_status === 1) {
            this.productInfo.fav_status = 0;
          } else {
            this.productInfo.fav_status = 1;
          }
          this.$message(data);
        });
      },
    },
    computed: {
      // 规格的长度
      specLen() {
        return this.productInfo.classify_list.length;
      },
      // 规格被选中的长度
      selectSpecLen() {
        let len = 0;
        this.selectedAttr.forEach((v) => {
          if (v !== '-1') {
            len += 1;
          }
        });
        return len;
      },
      // 最后一个被选规格的id和索引
      selectLastSpec() {
        let id = '-1';
        let index = '-1';
        this.selectedAttr.forEach((v, i) => {
          if (v !== '-1') {
            id = v;
            index = i;
          }
        });
        return {
          id,
          index,
        };
      },
    },
    created() {
      const { goods_id } = getQueryParams();
      this.goodsId = goods_id; // eslint-disable-line
      if (!this.goodsId) goBack();

      goodsApi.getInfo({ goods_id }).then(({ data }) => {
        this.marketable = data.saleable === 'true' || data.goods_store === 0;
        this.productInfo = data;
        this.store = data.goods_store;
        if (this.productInfo.classify_list) { // 多规格
          this.productInfo.classify_list.map((item) => {
            const classify = item;
            if (classify.list[0].img_src) {
              classify.type = 'image';
            }
            return classify;
          });
        } else { // 统一规格
          this.selectedProd = this.productInfo.product.filter(item => item.defaultselect)[0];
        }
        this.promotion = this.productInfo.promotion;
        this.defaultSelect();
        this.crumbs();
      }).catch(error => Message(error.errMsg));

      storeApi.getList().then((res) => {
        this.treeList = res.data.list || [];
      });
      recommend.getList({ recType: 2 }).then((res) => {
        this.recommendList = res.data.goodsList || [];
      });
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/mixins";
  @import "../../styles/variables";

  .page-store {
    margin-left: 10px;
    font-size: 12px;
    color: #888888;
    .page-store-no {
      color: $g-highlight;
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

  .choose-attrs-item {
    cursor: pointer;
    user-select: none;
    position: relative;
    display: inline-block;
    padding: 0 15px;
    font-size: 14px;
    color: #666666;
    border: 1px solid #dddddd;
    margin-right: 10px;
    margin-bottom: 10px;
    .tick {
      display: none;
    }
    img {
      height: 38px;
      margin-right: 5px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
    }
    &.active {
      border: 1px solid $g-highlight;
      .tick {
        display: block;
      }
    }
    &.inactive {
      cursor: not-allowed;
      background: #eeeeee;
      color: #cccccc;
    }
  }

  .page-detail {
    .border1 {
      border: 1px solid #e8e8e8;
    }

    .border-top {
      border: 1px solid #e8e8e8;
    }

    .goods-name {
      @include ellipsis2(2, 21px);

      box-sizing: border-box;
      color: #888888;
    }

    .title {
      height: 40px;
      line-height: 40px;
      background: #f6f6f6;

      .tag-line {
        width: 0;
        height: 10px;
        margin: 0 5px 0 10px;
        border: 2px solid $g-highlight;
        border-radius: 2000px;
      }
    }

    .bread-crumbs {
      line-height: 50px;
      background: #f5f5f5;

      .text {
        width: 1200px;
        margin: 0 auto;
        color: #666666;

        a {
          color: #666666;

          &:hover {
            color: #0089ff;
          }
        }

        span {
          padding: 0 10px;
        }

        :last-child {
          display: none;
        }
      }
    }

    .content {
      width: 1200px;
      padding: 20px 0;
      margin: 0 auto;

      .product-detail {
        width: 980px;
      }
    }

    .product-intro {
      padding-bottom: 20px;
      overflow: hidden;

      .preview-wrap {
        position: relative;
        float: left;
        width: 510px;
        height: 520px;
      }

      .item-info-wrap {
        float: right;
        width: 650px;
        color: #888888;

        .name {
          padding: 16px 0;
          font-size: 18px;
          line-height: 26px;
          color: #333333;
        }

        .item-hd {
          overflow: auto;

          .dt {
            float: left;
            width: 80px;
            padding-right: 4px;
            text-align: right;
          }

          .dd {
            float: left;
          }
        }

        .price-item {
          // padding-bottom: 5px;
          line-height: 45px;

          .price {
            font-size: 18px;
            color: $g-highlight;

            span {
              font-size: 22px;
            }
          }
        }

        .coupons-item {
          .coupons {
            li {
              display: inline-block;
              margin-right: 10px;
              font-size: 0;
              vertical-align: top;
              border-top: 1px solid $g-highlight;
              border-bottom: 1px solid $g-highlight;

              span {
                box-sizing: border-box;
                display: inline-block;
                height: 16px;
                vertical-align: top;

                &:first-child {
                  width: 5px;
                  background: url("~assets/images/coupons-l-bg.jpg") no-repeat center;
                }

                &:nth-child(2) {
                  padding: 0 3px;
                  font-size: 12px;
                  line-height: 16px;
                  color: $g-highlight;
                  background: white;
                }

                &:last-child {
                  width: 5px;
                  background: url("~assets/images/coupons-r-bg.jpg") no-repeat center;
                }
              }
            }
          }
        }

        .sales-promotion-item {
          padding-bottom: 10px;

          p {
            padding-bottom: 10px;

            span {
              padding: 0 4px;
              margin-right: 10px;
              color: white;
              background: #fa7d50;
              border-radius: 3px;
            }
          }
        }

        .summary {
          // padding-bottom: 15px;
          border: 1px solid #e3e3e3;
        }

        .choose-attrs {
          padding-bottom: 30px;
          line-height: 40px;
          border-left: 1px solid white;
          .classify {
            .dd {
              width: 560px;
              .el-radio-button {
                margin-bottom: 10px;
              }
            }
          }
        }

        .choose-attrs-list-wrap {
          font-size: 0;

          .radio-group-split {
            .el-radio-button {
              .el-radio-button__inner {
                height: 50px;
                padding: 5px 10px;
                line-height: 38px;

                img {
                  height: 38px;
                }

                .label {
                  display: inline-block;
                  height: 100%;
                  font-size: 14px;
                  vertical-align: 13px;
                }
              }
            }

            &.small {
              .el-radio-button .el-radio-button__inner {
                min-width: 40px;
                height: 40px;
                padding: 5px 15px;
                line-height: 30px;
              }
            }
          }

          .choose-attrs-list {
            position: relative;
            display: inline-block;
            min-width: 18px;
            padding: 5px 10px;
            margin-right: 10px;
            font-size: 0;
            line-height: 28px;
            text-align: center;
            cursor: pointer;
            border: 1px solid #e3e3e3;

            img {
              display: inline-block;
              width: auto;
              height: 35px;
              margin-right: 5px;
              vertical-align: middle;
              border: 0;
            }

            p {
              display: inline-block;
              font-size: 14px;
              vertical-align: middle;
            }
          }

          .choose-attrs-list-active {
            color: $g-highlight;
            border-color: $g-highlight;
          }
        }

        .choose-amount {
          margin-top: 5px;
          font-size: 0;
          line-height: 28px;
          border: 1px solid #e3e3e3;

          span {
            display: inline-block;
            width: 28px;
            font-size: 16px;
            color: #333333;
            text-align: center;
            vertical-align: top;
            cursor: pointer;
            background: #eeeeee;
          }

          input {
            box-sizing: border-box;
            display: inline-block;
            width: 65px;
            padding: 5px;
            font-size: 14px;
            line-height: 18px;
            color: #888888;
            text-align: center;
            vertical-align: top;
            border: 0;
            border-right: 1px solid #e3e3e3;
            border-left: 1px solid #e3e3e3;
          }
        }

        .choose-btns {
          padding-left: 20px;

          .btn {
            width: 170px;
            margin-right: 10px;

            &:nth-child(2) {
              margin-right: 0;
            }
          }

          p {
            display: inline-block;
            font-size: 16px;
            margin-left: 20px;
            cursor: pointer;

            i {
              margin-right: 10px;
              font-size: 24px;

              &.icon-star {
                color: #666666;
              }

              &.icon-star-fill {
                color: $g-highlight;
              }
            }
          }
        }
      }
    }

    .tab-main {
      position: relative;
      height: 49px;
      background: #f0f0f0;
      border-bottom: 1px solid #dddddd;

      ul {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 0;
      }

      li {
        display: inline-block;
        min-width: 98px;
        font-size: 14px;
        line-height: 47px;
        color: #888888;
        text-align: center;
        cursor: pointer;
        border-top: 2px solid #f0f0f0;
        border-bottom: 1px solid #dddddd;
        border-left: 1px solid #dddddd;

        &.active {
          color: #333333;
          background: white;
          border-top: 2px solid $g-highlight;
          border-bottom: 1px solid white;
        }

        &:hover {
          color: $g-highlight;
        }
      }
    }
  }
</style>

