<template>
  <div class="comments">
    <p class="no-comment" v-if="commentList.length <= 0">暂无评论</p>
    <div class="comment-item" v-for="(item, index) in commentList">
      <div class="user-column">
        <p class="user-name">{{item.member_name}}</p>
        <p class="time">{{item.create_time}}</p>
      </div>
      <div class="comment-column">
        <div class="comment-star" :class="'star' + item.star_num"></div>
        <p class="comment-con">{{item.details}}</p>
        <div class="pic-list" v-if="item.images">
          <div v-for="(pic, imgIndex) in item.images" class="pic-item"
               :class="{'pic-item-active' : (imgIndex == item.activeImg) }" @click="showPic(index, imgIndex)">
            <div class="pic-img" :style="{backgroundImage:`url(${pic})`}"></div>
          </div>
        </div>
        <div class="pic-view" v-if="item.activeImg >= 0">
          <div class="pic-view-img" @click.stop="hidePic(index)">
            <div class="small"></div>
            <img :src="item.images[item.activeImg]"/>
            <div class="prev" @click.stop="changeImage(index, 'prev')" v-if="item.activeImg > 0"></div>
            <div class="next" @click.stop="changeImage(index, 'next')" v-if="item.activeImg < item.images.length-1"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt30 tr" v-if="commentList.length > 0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="nPage"
        :page-size="nPageSize"
        layout="prev, pager, next, total, jumper"
        :total="allGoodsNum">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import ApiGoods from '../../api/goods';

  export default {
    props: {
      goodsId: '',
      page: {
        type: Number,
        default: 1,
      },
      pagesize: {
        type: Number,
        default: 20,
      },
      isShow: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        nPage: 1,
        nPageSize: 20,
        commentList: [],
        allGoodsNum: 0,
      };
    },
    created() {
    },
    methods: {
      handleCurrentChange(val) {
        this.nPage = val;
        this.getComment();
      },
      getComment() {
        ApiGoods.commentList({
          goods_id: this.goodsId,
          page: this.nPage,
          pagesize: this.nPageSize,
        }).then((res) => {
          this.commentList = res.data || [];
          this.allGoodsNum = res.count;
          this.commentList.forEach((item, index) => {
            this.$set(this.commentList[index], 'activeImg', '-1');
          });
        });
      },
      showPic(index, imgIndex) {
        this.commentList[index].activeImg = imgIndex;
      },
      hidePic(index) {
        this.commentList[index].activeImg = -1;
      },
      changeImage(index, type) {
        if (type === 'next') {
          this.commentList[index].activeImg += 1;
        } else {
          this.commentList[index].activeImg -= 1;
        }
      },
    },
    watch: {
      isShow(val) {
        if (val) {
          this.nPage = this.page;
          this.nPageSize = this.pagesize;
          this.getComment();
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/variables";

  .comments {

    .no-comment {
      font-size: 14px;
      padding: 50px 0;
      text-align: center;
      color: #666666;
    }

    .comment-item {
      padding: 10px 0;
      border-bottom: 1px solid #e3e3e3;
      font-size: 14px;
      line-height: 30px;
    }

    .user-column {
      float: left;
      width: 150px;
      padding: 0 20px;

      .user-name {
        color: #666666;
      }

      .time {
        color: #aaaaaa;
      }
    }

    .comment-column {
      padding-right: 20px;
      margin-left: 190px;

      .comment-star {
        width: 125px;
        height: 17px;
        margin: 6px 0;
        background: url("~assets/images/common/star.png") no-repeat;

        &.star0 {
          background-position: -125px 0;
        }

        &.star1 {
          background-position: -100px 0;
        }

        &.star2 {
          background-position: -75px 0;
        }

        &.star3 {
          background-position: -50px 0;
        }

        &.star4 {
          background-position: -25px 0;
        }

        &.star5 {
          background-position: 0 0;
        }
      }

      .pic-list {
        padding-bottom: 20px;
        font-size: 0;
      }

      .pic-item {
        display: inline-block;
        vertical-align: top;
        padding: 1px;
        border: 1px solid #dddddd;
        margin-top: 14px;
        margin-right: 12px;
        cursor: pointer;
        background: white;

        &-active {
          border: 2px solid $g-highlight;
          padding: 0;
        }
      }

      .pic-img {
        width: 56px;
        height: 56px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      .pic-view {
        overflow: auto;

        .pic-view-img {
          float: left;
          width: auto;
          height: auto;
          position: relative;
          cursor: pointer;

          .prev,
          .next {
            position: absolute;
            top: 0;
            width: 20%;
            max-width: 100px;
            min-width: 40px;
            height: 100%;
            z-index: 3;
          }

          .prev {
            left: 0;
            &:hover {
              background: url("~assets/images/common/prev.png") no-repeat center;
              background-size: 26px auto;
            }
          }

          .next {
            right: 0;
            &:hover {
              background: url("~assets/images/common/next.png") no-repeat center;
              background-size: 26px auto;
            }
          }

          .small {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            &:hover {
              background: url("~assets/images/common/small.png") no-repeat center;
            }
          }
        }

        img {
          display: block;
          max-width: 370px;
          max-height: 480px;
          border: 1px solid #dddddd;
        }
      }
    }
  }
</style>
