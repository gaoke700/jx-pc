<template>
  <div class="page-login">
    <layout-all>
      <div slot="site-top"></div>
      <div slot="site-header"></div>
      <div slot="shop-header"></div>
      <div slot="menu-bar"></div>
      <div slot="toolbar"></div>
      <div slot="page-content">
        <g-jx-logo></g-jx-logo>
        <div class="login-wrap">
          <a class="img" v-if="!isShop" :href="adImg.link || 'javascript:;'" :style="{backgroundImage:`url(${adImg.picpath})`}" target="_blank"></a>
          <a class="img" v-else :style="{backgroundImage:`url(${adImg.picpath})`}"></a>
          <div class="login-main">
            <div class="login-body" id="login-body"></div>
            <div class="login-footer">
              <div class="login-footer-item">
                <div class="login-footer-icon iconfont icon-quick"></div>
                <div class="login-footer-text">更快捷</div>
              </div>
              <div class="login-footer-item">
                <div class="login-footer-icon iconfont icon-safe"></div>
                <div class="login-footer-text">更安全</div>
              </div>
              <div class="login-footer-item">
                <div class="login-footer-icon iconfont icon-convenient"></div>
                <div class="login-footer-text">更方便</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </layout-all>
  </div>
</template>

<script>
  import config from '../../common/config';
  import GJxLogo from '../common/GJxLogo';
  import LayoutAll from '../layout/LayoutAll';
  import Utils from '../../utils/utils';
  import ApiPlatform from '../../api/platform';
  import loginHelper from '../../utils/loginHelper';

  export default {
    data() {
      return {
        adImg: {
          link: '',
          picpath: '',
        },
      };
    },
    components: {
      LayoutAll,
      GJxLogo,
    },
    computed: {
      isShop() {
        return Utils.isShop();
      },
      userName() {
        return (this.$store.state.userInfo.name || '');
      },
    },
    mounted() {
      let referrer = document.referrer;
      const href = window.location.href;
      const pathArr = referrer.split('/');
      const pathLink = pathArr[pathArr.length - 1];
      referrer = pathLink || 'index.html';

      const redirectUri = `${window.BASEDOMAIN}/${window.WX_LOGIN_URL}?refener_url=${href}`;

      this.$nextTick(() => {
        new WxLogin({
          // 第三方页面显示二维码的容器id
          id: 'login-body',
          // 应用唯一标识，在微信开放平台提交应用审核通过后获得
          appid: (window.APPID || ''),
          // 应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可
          scope: 'snsapi_login',
          // 重定向地址，需要进行UrlEncode
          redirect_uri: encodeURIComponent(redirectUri),
          // 用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），
          // 建议第三方带上该参数，可设置为简单的随机数加session进行校验
          state: referrer,
          // 提供"black"、"white"可选，默认为黑色文字描述。
          style: '',
          // 自定义样式链接，第三方可根据实际需求覆盖默认样式。
          href: '',
        });
      });
    },
    created() {
      /*
      if (window.FRONT_MODE === '360buy') {
        location.href = `https://login.xyunqi.com?refer_url=${encodeURIComponent(`http://shop.jdhaodian.com/wx_platform_login.php?refener_url=${encodeURIComponent(document.referrer || location.origin)}`)}`;
      }
      */

      const params = Utils.isShop() ? { type: 'wsc_c_login' } : {};
      ApiPlatform.get(params).then((res) => {
        const data = res || [];
        if (data[0]) {
          this.adImg = {
            link: data[0].link || '',
            picpath: data[0].picpath || '',
          };
        }
      });

      const host = window.location.host;
      const login = Utils.getUrlObj().login;
      const isProduction = host.indexOf('shop.jdhaodian.com') > -1 || host.indexOf('fy.xyunqi.com') > -1;
      if (loginHelper.isLocal() || host === '192.168.10.12' || host.indexOf('fy2.test1.shopex123.com') > -1 || isProduction) {
        const userInfo =
          (this.$cookie.get('userInfo') && JSON.parse(decodeURIComponent(this.$cookie.get('userInfo')) || '{}'))
          || JSON.parse(decodeURIComponent(window.location.hash || '').replace('#', '') || '{}');
        if (userInfo.name) {
          if (!isProduction) {
            this.$cookie.set('userInfo', encodeURIComponent(JSON.stringify(userInfo)), { expires: '7D' });
          }
          let redirect = userInfo.redirect_uri || 'index.html';
          if (redirect.indexOf('login.html') > -1) {
            redirect = 'index.html';
          }
          window.location.href = redirect;
        }
      }
      if (host === 'localhost:80881' && login) {
        let userInfo = JSON.parse(decodeURIComponent(this.$cookie.get('userInfo')) || '{}');
        userInfo = userInfo || {};
        if (!userInfo.name) {
          this.$cookie.set(
            'userInfo',
            encodeURIComponent(JSON.stringify(config.LOCAL_USER_INFO)),
            { expires: '7D', domain: window.location.hostname },
          );
          history.go(-1);
        }
      }
    },
  };
</script>

<style lang="scss">
  @import "../../styles/theme";

  .page-login {
    .login-wrap {
      position: relative;
      height: 600px;
      background: #ff644e;
      .img {
        display: block;
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
    }

    .login-main {
      position: absolute;
      top: 50%;
      right: 10%;
      margin-top: -235px;
      background: white;

      .login-body {
        iframe {
          display: block;
          margin: 0 auto;
        }
      }

      .login-footer {
        height: 66px;
        line-height: 66px;
        text-align: center;
        background: #f8f8f8;

        .login-footer-item {
          display: inline-block;
          margin: 0 20px;
          vertical-align: middle;

          .login-footer-icon {
            display: inline-block;
            width: 28px;
            height: 28px;
            margin-right: 10px;
            font-size: 14px;
            line-height: 28px;
            color: #bebebe;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #b6b6b6;
            border-radius: 50%;
          }

          .login-footer-text {
            display: inline-block;
            font-size: 14px;
            color: #666666;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>
