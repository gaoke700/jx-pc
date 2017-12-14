<template>
  <div class="site-top">
    <div class="container g-clearfix">
      <ul class="top-left" v-if="!isShop">
        <li>
          <i class="iconfont icon-home"></i>
          <a href="http://www.jxhaodian.com" class="home-back">京选首页</a>
        </li>
        <li class="divider mn1"></li>
        <li class="join-in">
          <a href="http://www.jdhaodian.com">商家入驻</a>
        </li>
      </ul>
      <ul class="top-menu">
        <dropdown v-if="userInfo.name" class="user">
          <template slot="title">
            <a href="my-index.html">{{userInfo.name}}</a>
            <span class="vip-badge" v-show="userInfo.vipName">{{userInfo.vipName}}</span>
            <i class="iconfont icon-angle-down"></i>
          </template>
          <div class="content-wrap">
            <div class="avatar-wrapper">
              <img class="avatar" width="50" height="50" :src="userInfo.userface">
            </div>
            <div class="card-info">
              <p>
                <span class="vip-name">
                  <template v-if="userInfo.vipName">
                  <i class="iconfont icon-card-vip"></i>
                  {{userInfo.vipName}}会员
                  </template>
                  <template v-else>&nbsp;</template>
                </span>
                <a href="javascript:;" class="logout fr" @click="loginOut">退出</a></p>
              <p>{{userInfo.vipDesc || '&nbsp;'}}</p>
            </div>
          </div>
        </dropdown>
        <li v-else><a class="js-page-login" :href="loginUrl">登录</a></li>
        <li>
          <a class="js-page-wodedingdan" slot="title" :href="orderUrl">我的订单</a>
        </li>
        <li class="divider"></li>
        <!--
                <li>我的收藏</li>
                <li class="divider"></li>
        -->
        <!--<li>客户服务</li>-->
        <li class="divider mn1"></li>
        <dropdown align="right" class="mobile">
          <div slot="title" class="red">
            <i class="iconfont icon-phone"></i>手机版
          </div>
          <div class="content-wrap">
            <img class="qrcode" width="100" height="100" :src="qrcodeUrl">
            <p>微信扫码打开</p>
            <p>移动微商城</p>
          </div>
        </dropdown>
      </ul>
    </div>
  </div>
</template>

<script>
  import Dropdown from '../../components/Dropdown';
  import Utils from '../../utils/utils';
  import { switchMobileUrl } from '../../utils/switchMboileUrl';
  import loginHelper from '../../utils/loginHelper';

  export default {
    props: {
      urlPrefix: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        loginUrl: `${this.urlPrefix}login.html`,
        orderUrl: `${this.urlPrefix}my-order.html`,
        userInfo: {},
        qrcodeUrl: '',
      };
    },
    components: {
      Dropdown,
    },
    computed: {
      isShop() {
        return Utils.isShop();
      },
    },
    methods: {
      loginOut() {
        this.$cookie.delete('userInfo', { domain: window.HOSTNAME });
        window.location.reload();
      },
      getQrcodeUrl() {
        const url = switchMobileUrl();
        this.qrcodeUrl = `http://qr.wdwd.com/qr?size=130&&txt=${url}`;
      },
    },
    created() {
      this.userInfo = this.$store.getters.userInfo;

      if (loginHelper.isLocal()) {
        this.loginUrl = `${this.urlPrefix}login.html?login=true`;
      }
      this.getQrcodeUrl();
      /*
      if (window.FRONT_MODE === '360buy') {
        this.loginUrl = `https://login.xyunqi.com?refer_url=${encodeURIComponent(`http://shop.jdhaodian.com/wx_platform_login.php?refener_url=${encodeURIComponent(location.href)}`)}`;
      }
      */
    },
  };
</script>

<style scoped lang="scss">
  @import "../../styles/theme";
  @import "../../styles/variables";

  .site-top {
    height: $site-top-height;
    font-size: 12px;
    line-height: $site-top-height;
    color: #888888;
    background-color: #f0f0f0;

    .home-back {
      color: inherit;
    }

    .iconfont {
      font-size: 14px;
    }

    .red {
      color: $g-highlight;
    }

    .mn1 {
      margin-right: -1px;
    }

    .container {
      box-sizing: border-box;
    }

    .ui-dropdown {
      position: relative;

      &.hover {
        .title {
          padding: 0 9px;
        }
      }

      .title {
        padding: 0 10px;
      }

      .content {
        padding: 10px 20px;
      }
    }

    .top-left,
    .top-menu {
      float: right;

      li {
        float: left;
        padding: 0 10px;

        a {
          color: #888888;
        }

        &.divider {
          width: 1px;
          height: 10px;
          padding: 0;
          margin-top: 11px;
          overflow: hidden;
          background-color: #cccccc;
        }

        &.red {
          color: $g-highlight;
        }

        &.user,
        &.mobile {
          padding: 0;
        }
      }
    }

    .top-left {
      float: left;
    }

    .top-menu {
      .content-wrap {
        padding: 10px;
        text-align: center;
      }

      .vip-badge {
        padding: 0 4px;
        margin: 8px;
        font-size: 11px;
        color: white;
        background-color: #ccbea3;
        border-radius: 10px;
      }
    }

    .join-in {
      // padding: 0 !important;

      .ui-dropdown {
        padding-left: 0;

        .content-wrap {
          padding: 0 10px;
          white-space: nowrap;
        }

        &.hover {
          padding: 0;
        }

        .content {
          width: 150px;
        }
      }
    }

    .user {
      .title {
        padding-left: 15px;
      }

      .content-wrap {
        width: 265px;
        padding: 10px;
        font-size: 0;

        .avatar-wrapper {
          display: inline-block;
          vertical-align: top;

          .avatar {
            display: block;
            border: 5px solid #e5e5e5;
            border-radius: 50%;
          }
        }

        .card-info {
          display: inline-block;
          width: 190px;
          padding-top: 5px;
          padding-left: 10px;
          font-size: 12px;
          line-height: 2em;
          vertical-align: top;

          .vip-name {
            color: #ccbea3;

            .icon-card-vip {
              font-size: 20px;
              vertical-align: middle;
            }
          }

          .logout {
            color: inherit;
          }
        }
      }
    }

    .mobile {
      .content {
        width: 102px;
        padding: 10px;
        text-align: center;

        p {
          font-weight: bold;
          line-height: 1.5em;
        }
      }
    }
  }
</style>
