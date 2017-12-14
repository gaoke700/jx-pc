<template>
  <div class="my-footer">
    <div class="nav-helper container g-clearfix">
      <dl>
        <dt>新手上路</dt>
        <dd>顾客必读</dd>
        <dd>会员等级折扣</dd>
        <dd>订单的几种状态</dd>
        <dd>积分奖励计划</dd>
        <dd>商品退货保障</dd>
      </dl>
      <dl>
        <dt>购物条款</dt>
        <dd>会员注册协议</dd>
        <dd>隐私保护政策</dd>
      </dl>
      <dl>
        <dt>支付/配送协议</dt>
        <dd>支付方式</dd>
        <dd>配送方式</dd>
        <dd>订单何时出库</dd>
        <dd>网上支付小贴士</dd>
        <dd>关于送货和验货</dd>
      </dl>
      <dl>
        <dt>售后服务</dt>
        <dd>体贴的售后服务</dd>
        <dd>网站使用条款</dd>
        <dd>网站免费声明</dd>
        <dd>简单的购物流程</dd>
      </dl>
      <dl>
        <dt>购物指南</dt>
        <dd>体贴的售后服务</dd>
        <dd>网站使用条款</dd>
        <dd>网站免费声明</dd>
        <dd>简单的购物流程</dd>
      </dl>
    </div>
    <div class="footer-nav">
      <ul class="container">
        <li><a href="#">关于我们</a></li>
        <li><a href="#">联系我们</a></li>
        <li><a href="#">招聘信息</a></li>
        <li><a href="#">最新公告</a></li>
        <li><a href="#">促销信息</a></li>
        <li><a href="#">站点地图</a></li>
        <li><a href="#">关于我们</a></li>
        <li><a href="#">联系我们</a></li>
        <li><a href="#">招聘信息</a></li>
        <li><a href="#">最新公告</a></li>
        <li><a href="#">促销信息</a></li>
        <li><a href="#">站点地图</a></li>
      </ul>
    </div>

    <div class="cooperative-partner">
      <a href="#"><img src="//img.alicdn.com/new/about/banner/zhifbao.gif"></a>
      <a href="#"><img src="//img.alicdn.com/bao/album/promotion/partner_msn_88x31.gif"></a>
      <a href="#"><img src="//img.alicdn.com/bao/album/promotion/partner_yahoo_88x31.gif"></a>
      <a href="#"><img src="//img.alicdn.com/new/about/banner/001.gif"></a>
      <a href="#"><img src="//img.alicdn.com/new/about/banner/023.gif"></a>
    </div>

    <p class="msg">修改本区域内容，请到 商店管理后台 >> 页面管理 >> 网页底部信息   进行编辑</p>

    <div class="copyright-info">
      <p>© 2001～2009 All rights reserved</p>
      <p>本商店顾客个人信息将不会被泄漏给其他任何机构和个人</p>
      <p>本商店logo和图片都已经申请保护，不经授权不得使用</p>
      <p>有任何购物问题请联系我们在线客服 | 电话：800-800-88888800 | 工作时间：周一至周五 8:00－18:00</p>
    </div>

    <div class="copyright-auth"></div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss">
  @import "../../styles/variables";
  .my-footer {
    margin-top: 25px;
    padding-bottom: 55px;
    background-color: white;

    .nav-helper {
      padding-top: 30px;
      padding-bottom: 30px;

      dl {
        float: left;
        display: block;
        width: percentage(1 / 5);

        dt {
          font-size: 20px;
          margin-bottom: 20px;
          color: #666666;
        }

        dd {
          line-height: 2.4;
          color: #666666;
        }
      }
    }

    .footer-nav {
      height: 70px;
      margin-bottom: 55px;
      color: white;
      font-size: 14px;
      background-color: $g-highlight;

      ul {
        width: 1000px;
        height: 70px;
        line-height: 70px;

        li {
          float: left;
          margin-left: 20px;

          a {
            color: inherit;
          }
        }
      }
    }

    .cooperative-partner,
    .msg,
    .copyright-info,
    .copyright-auth {
      text-align: center;
    }

    .cooperative-partner {
      height: 45px;

      img {
        width: 88px;
        height: 31px;
        margin-top: (45px - 31px) / 2;
      }
    }

    .msg {
      margin-bottom: 28px;
      color: red;
      font-size: 14px;
      text-align: center;
    }

    .copyright-auth {
      height: 70px;
      margin-top: 45px;
      background-color: #e9ecef;
    }
  }
</style>
