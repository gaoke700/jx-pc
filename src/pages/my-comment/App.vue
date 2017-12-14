<template>
  <layout-all class="my-collect-wrap">
    <div slot="my-menu"></div>
    <div slot="my-container">
      <div class="page-title">
        <template v-if="isShowCommentRemainder">
          <div class="page-title-item">
            <span class="page-title-item-icon iconfont icon-success"></span>
            提交成功！还有商品未评价，可继续评价
          </div>
          <div class="page-title-hint">此单其余{{commentRemainder}}件商品待评</div>
        </template>
        <div v-else class="page-title-item">评价订单</div>
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
              <div v-show="config[i].hintInfo !== ''" class="wrap-content-item wrap-content-hint">
                <span class="iconfont icon-warn"></span>
                <!--请至少填写一件商品的评价-->
                {{config[i].hintInfo}}
              </div>
              <div class="wrap-content-item wrap-content-star">
                <div class="wrap-content-side">商品满意度：</div>
                <div
                  @mouseout="starMouseOut(config[i])"
                  class="wrap-content-section">
                  <template v-for="(starV, starI) in config[i].starStatus">
                    <div
                      @click="starClick(config[i], starI)"
                      @mouseover="starMouseOver(config[i], starI)"
                      :class="[starV ? 'icon-star-fill' : 'icon-star']"
                      class="wrap-content-section-item iconfont">
                    </div>
                  </template>
                </div>
              </div>
              <label class="wrap-content-item wrap-content-comment">
                <span class="wrap-content-side">填写评价：</span>
                <span class="wrap-content-section">
                <textarea
                  v-model="config[i].comment"
                  :maxlength="commentMaxLen"
                  :minlength="commentMinLen"
                  class="wrap-content-section-textarea"
                  :placeholder="`长度在${commentMinLen}-${commentMaxLen}之间，写下您的购买体会，为其他小伙伴提供参考哦`" name="" id="comment"
                  cols="30" rows="10"></textarea>
                <span class="wrap-content-section-limit">{{config[i].comment.length}}/{{commentMaxLen}}</span>
              </span>
              </label>
              <div class="wrap-content-item wrap-content-upload">
                <span class="wrap-content-side">&nbsp</span>
                <upload
                  :params="{site_id:site_id}"
                  :maxLen="imgMaxLen"
                  :fileList="config[i].imgInfo">
                </upload>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="submit">
        <div class="submit-center">
          <div @click="mSubmit" class="submit-btn">提交</div>
          <div class="submit-name">
            <label>
              <span class="submit-name-item">
                <g-checkbox :isChecked="isNameless" @change="change"></g-checkbox>
              </span>
              <span class="submit-name-item submit-name-item-text">匿名评价</span>
            </label>
          </div>
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
        isSubmit: false,
        isNameless: false,
        isShowCommentRemainder: false,
        commentMinLen: 5,
        commentMaxLen: 120,
        imgMaxLen: 5,
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
    computed: {
      commentRemainder() {
        return this.info.length;
      },
    },
    methods: {
      mSubmit() {
        if (this.isSubmit) {
          return;
        }
        this.isSubmit = true;
        const dataInfo = [];
        const config = this.config;
        const info = this.info;
        config.forEach((value, index) => {
          const v = value;
          const infoV = this.info[index];
          v.isValidateSuccess = false;
          if (v.commentNowLen === -1) {
            v.hintInfo = '请您给出星星评价';
          } else if (v.comment.length < this.commentMinLen || v.comment.length > this.commentMaxLen) {
            v.hintInfo = '请您评论5-120个字';
          } else {
            v.hintInfo = '';
            v.isValidateSuccess = true;
            dataInfo.push({
              site_id: infoV.site_id,
              member_id: this.member_id,
              order_id: infoV.order_id,
              item_id: infoV.item_id,
              textArea: v.comment,
              starLen: v.starStatus.filter(v2 => v2 === true).length,
              imageIds: v.imgInfo.map(v2 => v2.image_id),
              nameNum: this.isNameless ? '1' : '0',
            });
          }
        });
        console.log(dataInfo);
        if (dataInfo.length === 0) {
          this.isSubmit = false;
        } else {
          commentOrder.postData({
            data: JSON.stringify(dataInfo),
          }).then((data) => {
            this.isSubmit = false;
            this.isShowCommentRemainder = true;
            for (let i = 0; i < config.length; i += 1) {
              if (config[i].isValidateSuccess) {
                info.splice(i, 1);
                config.splice(i, 1);
                i -= 1;
              }
            }
            console.log(info, config);
            if (this.commentRemainder === 0) {
              console.log('没有待评论的了,需要跳转了');
              this.isShowCommentRemainder = false;
              this.$message({
                message: '提交成功！1s后返回订单详情页',
                duration: 1000,
                onClose() {
                  const search = utils.getUrlObj();
                  if (!search.order_id) return;
                  location.href = `my-order-detail.html?order_id=${search.order_id}&site_id=${search.site_id}&member_id=${search.member_id}`;
                },
              });
            }
            console.log('接口响应:', data);
          });
        }
      },
      change() {
        this.isNameless = !this.isNameless;
      },
      starClick(conf, starI) {
        const config = conf;
        const starStatus = config.starStatus;
        config.commentNowLen = starI;
        starStatus.forEach((v, i2) => {
          starStatus.splice(i2, 1, i2 <= starI);
        });
      },
      starMouseOver(conf, starI) {
        const starStatus = conf.starStatus;
        starStatus.forEach((v2, i2) => {
          starStatus.splice(i2, 1, i2 <= starI);
        });
      },
      starMouseOut(conf) {
        const starStatus = conf.starStatus;
        starStatus.forEach((v2, i2) => {
          starStatus.splice(i2, 1, i2 <= conf.commentNowLen);
        });
      },
    },
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
        data.forEach((v) => {
          if (v.is_comment === '1') {
            return;
          }
          if (v.is_comment === '1') {
            return;
          }
          this.info.push(v);
          this.config.push({
            starStatus: [false, false, false, false, false],
            comment: '',
            hintInfo: '',
            commentNowLen: -1,
            imgInfo: [],
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
      user-select: none;
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
