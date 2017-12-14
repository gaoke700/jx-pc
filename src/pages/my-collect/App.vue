<template>
  <layout-all class="my-collect-wrap" :current-url="'my-collect.html'">

    <div class="collect-header">
      <div class="header-collect-count fl">
        我收藏的商品：共 <span>{{ info && info.length || 0 }}</span> 件
      </div>
      <div class="search-box fr">
        <input type="text" v-model="keyword" placeholder="请输入收藏的商品名称"
               @keyup.enter="getCollectList({ search_keywords: $event.target.value })">
        <i class="iconfont icon-search-thin" @click="getCollectList({ search_keywords: keyword })"></i>
      </div>
    </div>

    <div class="collect-content">
      <div class="collect-main" v-if="info && info.length > 0">
        <header>
          <span class="biao fl">全部商品</span>
          <span class="opeter fr">
            <span class="opeter-status" v-show="!isOpts" @click="opeterFun()">批量操作</span>
            <span class="opeter-status" v-show="isOpts">
              <g-checkbox :isChecked="isCheckedAll" @change="checkboxChange()">{{isCheckedAll ? '取消全选' : '全选'}}</g-checkbox>
              <!--<span class="opeter-status-span">加入购物车</span>-->
              <span @click="batchCancelCollection()" class="opeter-status-span">取消收藏</span>
              <span @click="cancelBatchFun()" class="opeter-status-span">完成</span>
            </span>
          </span>
        </header>
        <ul class="collect-list g-clearfix">
          <li v-for="(item, index) in info">
            <div class="list-top">
              <div class="img-box">
                <img :src="`${item.thumbnail_pic}`" alt="">
                <div class="sold-out" v-if="item.sales_status !== '在售'">{{ saleStatus(item) }}</div>
              </div>
              <p>{{ item.name }}</p>
              <div class="price">￥{{ item.price }}</div>
              <div class="list-top-btn">
                <a :href="`${item.shop_url}`" class="fl">访问店铺</a>
                <a href="javascript:;" class="fr" @click="cancelCollect(index)">取消收藏</a>
              </div>
            </div>
            <div class="list-btm-btn g-clearfix">
              <!--<a class="fl" href="javascript:void(0);" @click="addCart">加入购物车</a>-->
              <a :href="`${item.shop_url}detail.html?goods_id=${item.goods_id}`">立即购买</a>
            </div>
            <div class="cancel" :class="{ 'on' : (item.default_cancel_collect === true && !isOpts) }">
              <div class="cancel-text">
                <p>确认取消收藏此商品吗？</p>
              </div>
              <div class="cancel-btn">
                <button class="fl" @click="sureCancelCollect(index);">确认</button>
                <button class="fr" @click="item.default_cancel_collect = 'false';">取消</button>
              </div>
            </div>
            <div class="batch" :class="{ 'on' : isOpts }">
              <div class="fr batch-btn" :class="{ 'on' : config[index].isChecked }" @click="batchClick(config[index])">
                <i class="iconfont icon-success-thick"></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="ui-no-data" v-else>
        <img src="~assets/images/my/collect/no-collect.png"/>
        <p class="ui-no-data-text">您还没有收藏任何商品，随便逛逛</p>
        <p class="ui-no-data-target"><a href="index.html">返回首页</a></p>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import memberCollect from 'api/member-collect';
  import LayoutAll from '../my-layout/LayoutAll';
  import GCheckbox from '../../components/GCheckbox.vue';

  export default {
    components: {
      LayoutAll,
      GCheckbox,
    },

    data() {
      return {
        info: [],
        config: [
          /*
          {
            isChecked: false,
          },
          */
        ],
        isOpts: false,
        // defaultPageSize: 12,
        isCheckedAll: false,
        keyword: '',
        site_id: [],
        isSoldOut: '',
      };
    },

    methods: {
      // 批量取消收藏
      batchCancelCollection() {
        const config = this.config;
        const info = this.info;
        const goodsIds = [];
        config.forEach((v, i) => {
          if (v.isChecked) {
            goodsIds.push({ site_id: this.site_id[i], goods_id: info[i].goods_id });
          }
        });
        memberCollect.batchUpdate({
          goods_ids: JSON.stringify(goodsIds),
          status: 2,
        }).then((data) => {
          console.log(6666, data);
          for (let i = 0; i < this.config.length; i++) {
            if (config[i].isChecked) {
              config.splice(i, 1);
              info.splice(i, 1);
              i--;
            }
          }
        });
      },
      // 全选和不全选
      checkboxChange() {
        this.config = this.config.map(item => ({
          ...item,
          isChecked: !this.isCheckedAll,
        }));
        this.isCheckedAll = !this.isCheckedAll;
      },
      getCollectList(params) {
        memberCollect.getCollectList({
          //          page: 1,
          //          pagesize: this.defaultPageSize,
          ...params,
        }).then((data) => {
          this.info = data.data;
          this.info.forEach((v) => {
            this.config.push({
              isChecked: false,
            });
            this.site_id.push(v.site_id);
          });
        });
      },

      cancelCollect(i) {
        this.info[i].default_cancel_collect = true;
      },

      sureCancelCollect(i) {
        memberCollect.updateCollect({
          site_id: this.info[i].site_id,
          goods_id: this.info[i].goods_id,
          status: 2,
        }).then(() => {
          this.info.splice(i, 1);
          this.config.splice(i, 1);
        });
      },

      // 批量操作
      opeterFun() {
        this.isOpts = true;
      },

      // 完成
      cancelBatchFun() {
        this.isOpts = false;
      },
      // 是否全部选中
      mIsCheckedAll() {
        let b = true;
        this.config.forEach((v) => {
          if (!v.isChecked) {
            b = false;
          }
        });
        this.isCheckedAll = b;
      },
      // 选中or不选中
      batchClick(conf) {
        const config = conf;
        config.isChecked = !config.isChecked;
        this.mIsCheckedAll();
      },
      // 无货/已售馨
      saleStatus(item) {
        let statusText = '';
        if (item.sales_status === '已下架') {
          statusText = '已下架';
        }
        if (item.sales_status === '已售罄') {
          statusText = '无货';
        }
        return statusText;
      },
    },

    created() {
      this.getCollectList();
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  $red: $g-highlight;
  button {
    border: 0;
    background: none;
    cursor: pointer;
  }

  .my-collect-wrap {
    .collect-header {
      height: 50px;
      line-height: 50px;
      padding-left: 20px;
      background-color: white;
      font-size: 14px;
      color: #000000;
      .header-collect-count {
        font-weight: bold;
      }
      span {
        color: $red;
      }
      .search-box {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
        width: 290px;
        height: 30px;
        line-height: 30px;
        margin: 10px 20px;
        padding: 7px 18px;
        border: 1px solid #d0ced1;
        border-radius: 3px;
        input[type="text"] {
          position: absolute;
          top: 6px;
          width: 200px;
          height: 16px;
          border: 0;
          font-size: 12px;
        }
        i.iconfont {
          height: 30px;
          position: absolute;
          font-size: 22px;
          right: 20px;
          top: 0;
          color: #888888;
          cursor: pointer;
        }
      }
    }

    .collect-content {
      margin: 20px 0;
      padding: 20px;
      background-color: white;
      text-align: center;

      .collect-main {
        header {
          height: 20px;
          line-height: 20px;
          margin-bottom: 20px;
          font-size: 12px;
          color: #666666;
          .biao {
            font-size: 14px;
            color: #333333;
          }
          .opeter {
            cursor: pointer;
            .opeter-status {
              .g-checkbox {
                vertical-align: middle;
                display: inline-block;
              }
              .opeter-status-span {
                margin-left: 30px;
                vertical-align: middle;
              }
            }
          }
        }

        .collect-list {
          width: 1068px;

          li {
            float: left;
            position: relative;
            width: 248px;
            height: 272px;
            margin: 0 16px 20px 0;
            border: 1px solid #dddddd;

            .list-top {
              position: relative;
              width: 208px;
              padding: 0 20px 10px;
              &:hover {
                .list-top-btn {
                  display: block;
                }
              }
              .img-box {
                position: relative;
                width: 160px;
                height: 160px;
                margin: 0 auto;
                border: 0;
                background: #efefef;
                text-align: center;
                img {
                  width: 100%;
                  height: 100%;
                  border: 0;
                }
                .sold-out {
                  position: absolute;
                  left: 0;
                  bottom: 0;
                  z-index: 2;
                  width: 100%;
                  line-height: 28px;
                  background: rgba(0, 0, 0, 0.5);
                  font-size: 12px;
                  font-weight: bold;
                  color: #ffffff;
                  text-align: center;
                }
              }

              p {
                height: 36px;
                line-height: 36px;
                font-size: 12px;
                color: #000000;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .price {
                height: 21px;
                font-size: 16px;
                color: #fa0321;
                text-align: center;
                font-weight: bold;
              }

              .list-top-btn {
                display: none;
                width: 100%;
                line-height: 20px;
                padding: 5px 0;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
                background: rgba(0, 0, 0, 0.4);
                a {
                  display: inline-block;
                  width: 123px;
                  border-right: 1px solid #ffffff;
                  font-size: 14px;
                  color: #ffffff;
                  &:last-child {
                    border-right: 0;
                  }
                }
              }
            }

            .list-btm-btn {
              height: 24px;
              line-height: 24px;
              padding: 10px 0;
              background: #f7f7f7;
              border-top: 1px solid #dddddd;
              a {
                display: block;
                line-height: 24px;
                font-size: 13px;
                color: #666666;
                cursor: pointer;
              }
            }

            .cancel {
              display: none;
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 4;

              &.on {
                display: block;
              }

              .cancel-text {
                height: 228px;
                background: rgba(0, 0, 0, 0.5);

                p {
                  line-height: 28px;
                  padding: 100px 20px 0;
                  font-size: 16px;
                  color: #ffffff;
                  text-align: center;
                }
              }

              .cancel-btn {
                height: 44px;
                line-height: 44px;
                background: #f7f7f7;
                button {
                  width: 124px;
                  line-height: 44px;
                  font-size: 13px;
                  color: #666666;
                  &:first-child {
                    background: $g-highlight;
                    color: #ffffff;
                  }
                }
              }
            }

            .batch {
              display: none;
              width: 250px;
              height: 274px;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 3;
              background: rgba(0, 0, 0, 0.5);
              &.on {
                display: block;
              }
              .batch-btn {
                width: 30px;
                height: 30px;
                line-height: 30px;
                background: #5a5a5a;
                cursor: pointer;

                &.on {
                  background: $red;
                }
                i {
                  font-size: 18px;
                  color: #ffffff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
