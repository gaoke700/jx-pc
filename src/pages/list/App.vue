<template>
  <div class="page-list">
    <layout-all>
      <div slot="page-content">
        <div class="page-list-content pt20 pb30 m0a g-clearfix">
          <div class="left fl w200">
            <div class="search-box border1">
              <input v-model="keywords" class="w130 border1 pl5 pr5" type="text"/><span class="search-btn pointer ib tc"
                                                                                        @click="searchShop()">搜本店</span>
            </div>
            <div class="border1 mt10" v-if=" tree.treeList.length > 0 ">
              <div class="title f14 fb">
                <span class="tag-line ib mr5 ml10 vm"></span><span>全部商品分类</span>
              </div>
              <div class="content">
                <tree v-for="(value,index) in tree.treeList" :activeId="tree.activeId" :key="index"
                      @goCatList="goCatList" :info="value"></tree>
              </div>
            </div>
            <div class="shop-recommend border1 mt10" v-if="recommendList.length > 0">

              <div class="title f14 fb">
                <span class="tag-line ib mr5 ml10 vm"></span><span>店铺推荐</span>
              </div>
              <div class="content">
                <a :href="'detail.html?goods_id='+value.goods_id" class="p10 g-clearfix block border-top"
                   v-for="(value, index) in recommendList" :key="index">
                  <img :src="value.thumbnail_pic" class="w50 h50 border1 fl" alt="商品图片"/>
                  <div class="goods-name pt5 pl10 pr10 fr w120">{{value.name}}</div>
                </a>
              </div>
            </div>
            <div class="latest-active border1 mt10" v-if="latestActiveList.length > 0">

              <div class="title f14 fb">
                <span class="tag-line ib mr5 ml10 vm"></span> <span>最新活动</span>
              </div>
              <div class="content">
                <a :href="value.url" class="p10 border-top block" v-for="(value, index) in latestActiveList"
                   :key="index">
                  <img :src="value.src" class="w180 h180" alt="商品图片">
                </a>
              </div>
            </div>
          </div>
          <div class="right fr">
            <div class="order-by border1 g-clearfix">
              <div class="fl">
                <div class="btns ib pl5 pr5 mr5 pointer border1" :class="{' active':orderType.currentOrder==1}"
                     @click="changeOrder(1)">综合排序
                </div>
                <div class="btns ib pl5 pr5 mr5 pointer border1" :class="{' active':orderType.currentOrder==2}"
                     @click="changeOrder(2)">
                  销量<span class="iconfont f12 icon-arrow-down"></span>
                </div>
                <div class="btns ib pl5 pr5 mr5 pointer border1" :class="{' active':orderType.currentOrder==3}"
                     @click="changeOrder(3)">
                  价格<span class="iconfont f12 "
                          :class=" (orderType.price_desc == true)? ' icon-arrow-down' : ' icon-arrow-up' "></span>
                </div>
              </div>
              <div class="fr g-clearfix">
                <div class="fl lh150" :style="{ marginTop: '7px' }">
                  <el-pagination
                    @size-change="handleSizeChange"
                    :page-sizes="[20, 40, 80]"
                    :page-size="parseInt(sendData.pagesize)"
                    layout="sizes">
                  </el-pagination>
                </div>
                <span class="fr"> 共 {{ allGoodsNum }} 件商品</span>
              </div>
            </div>
            <div class="g-clearfix pt10">
              <div class="fl mr20 mt10"
                   v-for="(value, index) in goodsList" :key="index"
                   :style="{
                     marginRight: (index + 1) % 4 === 0 ? 0 : ''

                 }"
              >
                <g-product-item
                  :info="value"
                  :imgStyle="{
                     width: '230px'
                  }"
                  :cartStyle="{
                    fontSize: '18px'
                  }"
                  :priceStyle="{
                    fontSize: '18px'
                  }"
                ></g-product-item>
              </div>
            </div>
            <div class="pt30 tr" v-if=" allGoodsNum > sendData.pagesize ">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="sendData.page"
                :page-size="parseInt(sendData.pagesize)"
                layout="prev, pager, next, total, jumper"
                :total="allGoodsNum">
              </el-pagination>
            </div>
            <div v-if="allGoodsNum===0" class="no-fit-goods mt10 tc">没有找到符合条件的商品，换个条件搜索一下试试吧。</div>
          </div>
        </div>
      </div>
    </layout-all>
  </div>
</template>

<script>
  import utils from 'utils/utils';
  import storeApi from 'api/store';
  import recommend from 'api/recommend';
  import goodsList from 'api/goods-list';
  import LayoutAll from '../layout/LayoutAll.vue';
  import GProductItem from '../common/GProductItem.vue';
  import Tree from '../common/Tree.vue';

  export default {
    components: {
      GProductItem,
      LayoutAll,
      Tree,
    },
    data() {
      return {
        goodsList: [],
        tree: {
          treeList: [],
          activeId: '',
        },
        recommendList: [],
        latestActiveList: [],
        keywords: '',
        sendData: {
          sort_type: 'multiple:true',
          pagesize: 20,
          page: 1,
        },
        allGoodsNum: 0,
        orderType: {
          currentOrder: 1,
          price_desc: true,
        },
      };
    },
    created() {
      // 树形分类
      storeApi.getList().then((res) => {
        this.tree.treeList = res.data.list || [];
      });
      // 商品推荐
      recommend.getList({ recType: 2 }).then((res) => {
        this.recommendList = res.data.goodsList || [];
      });
      // 最新活动
      // 获取综合排序列表
      if (utils.getUrlObj().cat_id) {
        this.goCatList(utils.getUrlObj().cat_id);
      } else if (utils.getUrlObj().search_keywords) {
        this.searchShop(decodeURIComponent(utils.getUrlObj().search_keywords));
      } else {
        this.getGoodsList();
      }
    },
    mounted() {},
    methods: {
      searchShop(val) {
        if (this.keywords !== '') {
          this.sendData.search_keywords = this.keywords;
          delete this.sendData.cat_id;
        } else if (val) {
          this.sendData.search_keywords = val;
          delete this.sendData.cat_id;
        } else {
          delete this.sendData.search_keywords;
          delete this.sendData.cat_id;
        }
        this.getGoodsList();
      },
      goCatList(val) {
        this.tree.activeId = val;
        this.sendData.cat_id = [{ id: val }];
        delete this.sendData.search_keywords;
        this.getGoodsList();
      },
      handleSizeChange(val) {
        this.sendData.pagesize = val;
        this.sendData.page = 1;
        this.getGoodsList();
      },
      handleCurrentChange(val) {
        this.sendData.page = val;
        this.getGoodsList();
      },
      changeOrder(val) {
        if (this.orderType.currentOrder !== val || val === 3) {
          if (val === 1) {
            this.sendData.sort_type = 'multiple:true';
          } else if (val === 2) {
            this.sendData.sort_type = 'sales:desc';
          } else if (val === 3) {
            if (this.orderType.currentOrder === val) {
              this.orderType.price_desc = !this.orderType.price_desc;
            }
            if (this.orderType.price_desc) {
              this.sendData.sort_type = 'price:desc';
            } else {
              this.sendData.sort_type = 'price:asc';
            }
          }
          this.orderType.currentOrder = val;
          this.getGoodsList();
        }
      },
      getGoodsList() {
        goodsList.getGoodsList(this.sendData).then((res) => {
          this.goodsList = res.data || [];
          this.allGoodsNum = parseInt(res.count, 10) || 0;
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/theme";
  @import "../../styles/variables";

  .page-list {
    .page-list-content {
      width: $page-width;
      $border1: 1px solid #e8e8e8;

      .border1 {
        border: $border1;
      }

      .border-top {
        border-top: $border1;
      }

      .left {
        // 标题
        .title {
          height: 40px;
          line-height: 40px;
          background: #f6f6f6;

          .tag-line {
            width: 0;
            height: 10px;
            margin: 0 5px 2px 10px;
            border: 2px solid $g-highlight;
            border-radius: 2000px;
          }
        }

        // 搜索框
        .search-box {
          padding: 9px 10px;
          background: #f6f6f6;

          input {
            box-sizing: border-box;
            height: 26px;
          }

          .search-btn {
            display: inline-block;
            width: 48px;
            line-height: 26px;
            color: white;
            background: #666666;
          }
        }

        // 商品推荐
        .shop-recommend {
          .goods-name {
            @include ellipsis2(2, 21px);

            box-sizing: border-box;
            color: #888888;
          }
        }
      }

      .right {
        width: 980px;

        .order-by {
          height: 44px;
          padding: 0 9px;
          line-height: 44px;
          background: #f6f6f6;

          .btns {
            box-sizing: border-box;
            height: 24px;
            line-height: 23px;
            color: #666666;
            background: white;

            &:hover {
              color: $g-highlight;
              border: 1px solid $g-highlight;

              .iconfont {
                color: $g-highlight;
              }
            }

            .iconfont {
              color: #bbbbbb;
            }

            &.active {
              color: $g-highlight;
              border: 1px solid $g-highlight;

              .iconfont {
                color: $g-highlight;
              }
            }
          }
        }

        .no-fit-goods {
          height: 40px;
          line-height: 40px;
          color: $g-highlight;
          background: #fff8f2;
          border: 1px solid #fed8d3;
        }
      }
    }
  }
</style>
