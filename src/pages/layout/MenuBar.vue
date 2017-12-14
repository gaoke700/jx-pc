<template>
  <div class="menubar">
    <div class="wrapper">
      <div class="cate-menu">
        <a :class="{ 'hover': isShowCate }" class="all-product" href="javascript:;" @mouseover="showCate(true)" @mouseout="showCate(false)">所有商品分类<span></span></a>
        <a href="index.html">首页</a>
        <a v-for="item in navItem" :href="item.link ? item.link : 'javascript:;'">{{ item.name }}</a>
      </div>
      <div class="cate-pop" v-show="isShowCate" @mouseover="showCate(true)" @mouseout="showCate(false)">
        <div>
          <div class="sub-pannel" v-for="(item, index) in categoryList" v-if="index < 9">
            <div class="sub-title"><a :href="'list.html?cat_id=' + item.id">{{item.text}}</a></div>
            <ul class="sub-list">
              <li v-for="(childItem, childIndex) in item.child" v-if="childIndex<9"><a :href="'list.html?cat_id=' + childItem.id">{{childItem.text}}</a></li>
              <li v-if="item.child && item.child.length > 9"><a class="hover" href="list.html">查看更多 >></a></li>
            </ul>
          </div>
          <div class="sub-pannel" v-if="categoryList.length > 9">
            <div class="sub-title"><a class="hover" href="list.html">更多分类 >></a></div>
          </div>
        </div>
        <a href="list.html" class="site-all-product">本店所有商品</a>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import ApiCategory from '../../api/category';

  export default {
    data() {
      return {
        isShowCate: false,
        categoryList: [],
      };
    },
    created() {
      this.getIndexModule();
      ApiCategory.getList().then((res) => {
        this.categoryList = res.list || [];
      });
    },
    computed: {
      navItem() {
        return this.$store.state.indexModule.nav;
      },
    },
    methods: {
      showCate(opt) {
        this.isShowCate = opt;
      },
      ...mapActions(['getIndexModule']),
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  .menubar {
    height: 40px;
    line-height: 40px;
    color: white;
    background-color: #282724;

    .wrapper {
      position: relative;
      z-index: 50;
      width: $page-width;
      height: 100%;
      margin-right: auto;
      margin-left: auto;
      font-size: 0;

      .cate-menu {
        a {
          display: inline-block;
          min-width: 79px;
          padding: 0 10px;
          font-size: 12px;
          line-height: 40px;
          color: white;
          text-align: center;
          border-right: 1px solid #3e3d3a;

          &:hover,
          &.hover {
            background: $g-highlight;
          }
        }

        .all-product {
          width: 150px;

          span {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-left: 8px;
            vertical-align: -1px;
            background: url("../../assets/images/menubar/all-product.png") no-repeat center;
          }
        }
      }

      .cate-pop {
        position: absolute;
        top: 40px;
        left: 0;
        box-sizing: border-box;
        width: 100%;
        padding: 0 29px 25px;
        background: white;
        border: 1px solid #eeeeee;
        border-top: 0;

        > div {
          padding-bottom: 10px;
          border-bottom: 1px solid #eeeeee;
        }

        a {
          color: #333333;

          &:hover,
          &.hover {
            color: $g-highlight;
          }
        }

        .sub-pannel {
          display: inline-block;
          width: 114px;
          font-size: 12px;
          vertical-align: top;
        }

        .sub-title {
          height: 44px;
          padding-top: 14px;
          padding-right: 10px;
          margin-bottom: 10px;
          overflow: hidden;
          font-size: 14px;
          font-weight: bold;
          line-height: 44px;
          border-bottom: 1px solid #dddddd;
        }

        .sub-list {
          line-height: 28px;
        }

        .site-all-product {
          display: block;
          width: 118px;
          margin-top: 20px;
          font-size: 12px;
          font-weight: bold;
          line-height: 22px;
          text-align: center;
          border: 1px solid #aaaaaa;
          border-radius: 20px;

          &:hover {
            color: white;
            background: $g-highlight;
            border-color: $g-highlight;
          }
        }
      }
    }
  }
</style>
