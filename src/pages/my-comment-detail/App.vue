<template>
  <layout-all class="my-collect-wrap">
    <div slot="my-menu"></div>
    <div slot="my-container">
      <div class="page-title">
        <div class="page-title-item">订单评价</div>
        <div class="page-title-hint">订单编号：  238246591082354</div>
      </div>
      <div class="wrap">
        <template v-for="(v,i) in info">
          <div class="wrap-item">
            <div class="wrap-side">
              <a :href="`detail.html?goods_id=${v.goods_id}&site_id=${site_id}&member_id=${member_id}`">
                <div
                  :style="{backgroundImage:`url(${v.thumbnail_pic})`}"
                  class="wrap-side-img"></div>
                <div class="wrap-side-desc">{{v.name}}</div>
                <div class="wrap-side-price">￥{{v.price}}</div>
                <div class="wrap-side-spec">{{v.addon}}</div>
              </a>
            </div>
            <div class="wrap-content">
              <div class="wrap-content-item wrap-content-star">
                <div class="wrap-content-side">商品满意度：</div>
                <div
                  class="wrap-content-section">
                  <template v-for="(starV, starI) in config[i].starStatus">
                    <div
                      :class="[starV ? 'icon-star-fill' : 'icon-star']"
                      class="wrap-content-section-item iconfont">
                    </div>
                  </template>
                </div>
              </div>
              <label class="wrap-content-item wrap-content-comment">
                <span class="wrap-content-side">填写评价：</span>
                <span class="wrap-content-section">{{config[i].comment}}</span>
              </label>
              <div class="wrap-content-item wrap-content-upload">
                <span class="wrap-content-side">&nbsp</span>
                <span class="wrap-content-section">
                  <label
                    v-for="(imgInfoV, imgInfoI) in config[i].imgInfo"
                    class="upload upload-active">
                    <el-popover
                      placement="top"
                      width="300"
                      trigger="hover">
                      <div>
                        <img style="max-width: 100%;" :src="imgInfoV.img_source" alt="">
                      </div>
                      <span slot="reference" :style="{backgroundImage:`url(${imgInfoV.img_source})`}" class="upload-img"></span>
                    </el-popover>
                  </label>
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="submit">
        <div class="submit-center">
          <a :href="`my-order.html`" class="submit-btn">返回订单列表</a>
          <a :href="`my-comment.html?order_id=${order_id}&site_id=${site_id}&member_id=${member_id}`" v-if="info.length < allDataLen" class="submit-btn">继续评价</a>
        </div>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import gCheckbox from 'components/GCheckbox.vue';
  import commentOrder from 'api/comment-order';
  import utils from 'utils/utils';
  import LayoutAll from '../my-layout/LayoutAll';

  export default {
    data() {
      return {
        allDataLen: 0,
        order_id: null,
        site_id: null,
        member_id: null,
        info: [
          /*
          {},
          */
        ],
        config: [
          /*
          {
            starStatus: [false, false, false, false, false],
            comment: '',
            hintInfo: '',
            commentNowLen: -1,
            imgInfo: [
              {
                "image_id": "7977",
                "img_source": "http://qmfx-s39210.s3.fy.shopex.cn/gpic/20170913/fc56469ebcd7df135919d19bbf48765a.png",
                "width": 74,
                "height": 44,
                "name": "code3120.png"
              },
            ],
            isValidateSuccess: false,
          },
          */
        ],
      };
    },
    computed: {},
    methods: {},
    created() {
      const search = utils.getUrlObj();
      if (!this.site_id) {
        this.site_id = search.site_id;
      }
      if (!this.order_id) {
        this.order_id = search.order_id;
      }
      if (!this.member_id) {
        this.member_id = search.member_id;
      }
      commentOrder.getData({
        order_id: search.order_id,
        site_id: search.site_id,
        member_id: search.member_id,
      }).then((data) => {
        this.allDataLen = data.length;
        data.forEach((v) => {
          if (v.is_comment === '0') {
            return;
          }
          this.info.push(v);
          const cmt = v.comment;
          const starStatus = [];
          for (let i = 1; i <= 5; i += 1) {
            starStatus.push(i <= (cmt.star_num * 1));
          }
          this.config.push({
            starStatus,
            comment: cmt.details,
            hintInfo: '',
            commentNowLen: -1,
            imgInfo: cmt.imgs_info,
            isValidateSuccess: false,
          });
        });
      });
    },
    components: {
      LayoutAll,
      gCheckbox,
    },
  };
</script>

<style lang="scss">
  @import "../../styles/theme";
  @import "../../styles/variables";

  .page-title {
    padding: 40px 0;
    text-align: center;
    .page-title-item {
      font-weight: bold;
      font-size: 24px;
      color: #333333;
      letter-spacing: 0;
      line-height: 22px;
      .page-title-item-icon {
        color: #4c8b03;
        font-size: 34px;
        vertical-align: middle;
      }
    }
    .page-title-hint {
      font-size: 14px;
      color: #666666;
      letter-spacing: 0;
      margin-top: 20px;
    }
  }

  .submit {
    padding: 30px 0;
    text-align: center;
    margin-top: 20px;
    background: #ffffff;
    .submit-center {
      display: inline-block;
      vertical-align: middle;
      @include clearfix;
    }
    .submit-btn {
      width: 150px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
      background: $g-highlight;
      border-radius: 4px;
      float: left;
      margin: 0 15px;
      cursor: pointer;
    }
    .submit-name {
      float: left;
      margin: 13px 15px 0;
      .submit-name-item {
        float: left;
      }
      .submit-name-item-text {
        font-size: 12px;
        color: #333333;
        letter-spacing: 0;
        line-height: 1;
        text-align: left;
        margin-left: 10px;
      }
    }
  }

  .wrap {
    .wrap-item {
      background: #ffffff;
      padding: 30px 0;
      border-bottom: 1px solid #efefef;
      @include clearfix();
      .wrap-side {
        float: left;
        padding: 10px 60px 0;
        border-right: 2px solid #dddddd;
        width: 332px;
        box-sizing: border-box;
        text-align: center;
        .wrap-side-img {
          width: 140px;
          height: 140px;
          background: center center no-repeat #cccccc;
          background-size: cover;
          margin: 0 auto 14px;
        }
        .wrap-side-desc {
          font-size: 12px;
          color: #666666;
          line-height: 20px;
          margin-bottom: 10px;
        }
        .wrap-side-price {
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .wrap-side-spec {
          font-size: 12px;
          color: #666666;
          line-height: 20px;
        }
      }
      .wrap-content {
        float: left;
        padding: 0 60px;
        font-size: 12px;
        color: #333333;
        line-height: 20px;
        width: 868px;
        box-sizing: border-box;
        .wrap-content-item {
          @include clearfix;
          display: block;
          margin-bottom: 20px;
          .wrap-content-side {
            width: 92px;
            text-align: left;
            float: left;
          }
          .wrap-content-section {
            width: 650px;
            float: left;
            word-break: break-all;
          }
        }
        .wrap-content-hint {
          color: #d0021b;
          line-height: 20px;
          text-align: left;
          margin-bottom: 0;
        }
        .wrap-content-star {
          margin-top: 20px;
          .wrap-content-section {
            @include clearfix;
            margin-top: 3px;
            .wrap-content-section-item {
              float: left;
              font-size: 18px;
              width: 20px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              &.icon-star-fill {
                color: $g-highlight;
              }
            }
          }
        }
        .wrap-content-comment {
          @include clearfix;
          .wrap-content-section {
            @include clearfix;
            .wrap-content-section-textarea {
              float: left;
              background: #ffffff;
              border: 1px solid #dddddd;
              width: 568px;
              height: 78px;
              padding: 6px 10px;
              box-sizing: border-box;
            }
            .wrap-content-section-limit {
              float: left;
              font-size: 12px;
              color: #888888;
              text-align: left;
              margin-left: 10px;
              margin-top: 56px;
            }
          }
        }
        .wrap-content-upload {
          margin-bottom: 0;
          .upload {
            cursor: pointer;
            background: #ffffff;
            border: 2px dashed #dddddd;
            width: 56px;
            height: 56px;
            position: relative;
            float: left;
            box-sizing: border-box;
            margin-right: 10px;
            &::before,
            &::after {
              display: block;
              content: "";
              position: absolute;
              top: 50%;
              left: 50%;
              background: #d8d8d8;
            }
            &::before {
              width: 22px;
              height: 4px;
              margin-top: -2px;
              margin-left: -11px;
            }
            &::after {
              height: 22px;
              width: 4px;
              margin-top: -11px;
              margin-left: -2px;
            }
            .upload-img {
              display: none;
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              background: center center no-repeat #cccccc;
              background-size: cover;
              z-index: 2;
            }
            .upload-del {
              display: none;
              position: absolute;
              font-size: 14px;
              width: 16px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.4);
              color: #ffffff;
              right: -8px;
              top: -8px;
              z-index: 3;
            }
            &.upload-active {
              border: none;
              .upload-img {
                display: block;
              }
              .upload-del {
                display: block;
              }
            }
          }
          .upload-desc {
            float: left;
            margin-top: 18px;
            font-size: 12px;
            color: #333333;
            line-height: 20px;
            text-align: left;
          }
        }
      }
    }
  }
</style>
