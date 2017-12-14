<template>
  <layout-all class="my-member-wrap" :current-url="'my-member-card.html'">
    <div class="member">
      <div class="member-list-wrap" v-if="cardList && cardList.length > 0">
        <header>
          我持有的会员卡：共<b>{{ count }}</b>张
          <span>（您在每个店铺最多拥有一张会员卡）</span>
        </header>
        <div class="member-list-box  g-clearfix">
          <div class="member-card" v-for="item in cardList">
            <div class="card" :style="backgroundImage(item)">
              <div class="card-wrap" v-if="item.bg_checkon === '0'">
                <img :src="item.store_logo">
                <span class="name">{{ item.store_name || '无' }}</span>
                <span class="type">{{ item.name }}</span>
              </div>
              <div class="number">NO:{{ item.member_lv_cardnum }}</div>
              <!-- 遮罩 -->
              <img class="card-mask" v-if="item.bg_checkon === '0'" src="~assets/images/my/member-card/banner.png">
            </div>
            <div class="member-info">
              <div class="info-list">
                <label>会员卡名称：</label>
                <span>{{ item.name || '无' }}</span>
              </div>
              <div class="info-list">
                <label>会员特权：</label>
                <span class="special">{{ item.free_postage === '1' ? '购物包邮' : '' }}  {{ item.dis_count || 0 }}折</span>
              </div>
              <div class="info-list">
                <label>所属店铺名称：</label>
                <span>{{ item.store_name || '无' }}</span>
              </div>
              <div class="info-list">
                <label>联系电话：</label>
                <span>{{ item.cs_info.qq || '无' }}</span>
              </div>
              <div class="info-list">
                <label>使用须知：</label>
                <span>{{ item.intro || '无' }}</span>
              </div>
            </div>
            <a class="join" :href="item.store_url">进入店铺></a>
          </div>
        </div>
      </div>
      <div class="ui-no-data" v-else>
        <img src="~assets/images/my/member-card/no-member-card.png"/>
        <p class="ui-no-data-text">您尚未持有会员卡</p>
        <p class="ui-no-data-target"><a href="index.html">返回首页</a></p>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import memberCardList from 'api/member-card-list';
  import LayoutAll from '../my-layout/LayoutAll';

  export default {
    components: {
      LayoutAll,
    },

    data() {
      return {
        cardList: [],
        count: [],
      };
    },

    methods: {
      getMemberList(params) {
        memberCardList.getMemberList(params).then((data) => {
          this.cardList = data.card_list;
          this.count = data.count;
        });
      },

      backgroundImage(item) {
        if (item.bg_checkon === '1') {
          return {
            backgroundImage: `url(${item.bg_pic})`,
            backgroundRepeat: 'no-repeat',
          };
        }
        return {
          backgroundColor: item.bg_color,
        };
      },
    },

    created() {
      this.getMemberList();
    },
  };
</script>

<style lang="scss">
  @import "../../styles/variables";

  $red: $g-highlight;
  .my-member-wrap {
    .member {
      padding: 20px 0 20px 20px;
      background: white;

      .member-list-wrap {
        header {
          line-height: 20px;
          font-size: 14px;
          color: #333333;

          b {
            color: $red;
          }
          span {
            display: inline-block;
            margin-left: 15px;
            font-size: 12px;
            color: #888888;
          }
        }

        .member-list-box {
          .member-card {
            display: inline-block;
            width: 472px;
            padding: 20px 20px 10px;
            border: 1px solid #dddddd;
            margin: 20px 20px 0 0;
            vertical-align: top;

            .card {
              position: relative;
              width: 252px;
              height: 110px;
              margin-bottom: 20px;
              padding: 30px 20px 20px 30px;
              border-radius: 10px;
              background-repeat: no-repeat;
              background-size: cover;
              color: #735b1e;
              .card-wrap {
                img {
                  float: left;
                  width: 66px;
                  height: 66px;
                  border-radius: 50%;
                }
                span {
                  float: left;
                  display: inline-block;
                  width: 252px;
                  height: 66px;
                  margin: 0 20px 0 30px;
                  position: absolute;
                  left: 0;
                  z-index: 5;
                  text-indent: 80px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  &.name {
                    line-height: 66px;
                    font-size: 20px;
                    top: 30px;
                  }
                  &.type {
                    top: 75px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                  }
                }
              }
              .number {
                width: 252px;
                line-height: 20px;
                position: absolute;
                left: 30px;
                bottom: 20px;
                font-size: 16px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .card-mask {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
                width: 302px;
                height: 160px;
              }
            }

            .member-info {
              margin-bottom: 20px;
              .info-list {
                position: relative;
                font-size: 12px;
                color: #333333;

                label {
                  display: inline-block;
                  width: 84px;
                  line-height: 24px;
                  margin-right: 15px;
                  position: absolute;
                  left: 0;
                  top: 0;
                  text-align: right;
                }

                span {
                  display: inline-block;
                  line-height: 24px;
                  margin-left: 99px;
                  color: #666666;
                  text-align: left;
                  &.special {
                    color: $red;
                  }
                }
              }
            }

            .join {
              display: block;
              font-size: 13px;
              color: #006de7;
              text-align: right;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
