<template>
  <div class="site-footer">
    <div v-if="!isShop" class="renzheng">
      <div class="m0a">
        <div class="ib mr70">
          <span class="renzheng-icon vm" style="background-position-x: -153px;"></span>
          <span class="ml10 cursor-default vm">100%正品保证</span>
        </div>
        <div class="ib mr70">
          <span class="renzheng-icon vm" style="background-position-x: -213px;"></span>
          <span class="ml10 cursor-default vm">商家精挑精选</span>
        </div>
        <div class="ib mr70">
          <span class="renzheng-icon vm" style="background-position-x: -272px;"></span>
          <span class="ml10 cursor-default vm">底价不需犹豫</span>
        </div>
        <div class="ib ">
          <span class="renzheng-icon vm" style="background-position-x: -332px;"></span>
          <span class="ml10 cursor-default vm">安全支付可靠</span>
        </div>
      </div>
    </div>
    <div v-if="!isShop" class="logo pt30 pb20">
      <div class="ib vm pt15"><span>POWERED BY</span><span class="fb ml10">京东云&nbsp;&nbsp;商派云起</span></div><img class="w230 ml20 vm" src="~assets/images/common/footer-logo.png" alt="foot-logo">
    </div>
    <p>软件企业编号：沪R-2008-0257 | 高新技术企业编号：GR200831001668 增值电信业务经营许可证：沪B2-20080057 | 沪ICP备16051693号</p>
    <p><img class="police-badge" src="~assets/images/police-badge.png">
      沪公网安备 31010402001730号 © 2003-2017 ShopEx,Inc.All rights reserved.</p>
    <p>上海市互联网违法和不良信息举报中心</p>
  </div>
</template>

<script>
  import Utils from '../../utils/utils';

  export default {
    computed: {
      isShop() {
        return Utils.isShop();
      },
    },
  };
</script>

<style lang="scss">
  .site-footer {
    line-height: 1;
    padding: 30px 0;
    font-size: 12px;
    color: #666666;
    text-align: center;
    background-color: #fefefe;

    .renzheng {
      height: 100px;
      line-height: 100px;
      background: #eaeaea;
      font-size: 18px;

      .renzheng-icon {
        display: inline-block;
        width: 50px;
        height: 50px;
        background: url('~assets/images/common/icon-images.png');
        background-repeat: no-repeat;
        background-position-y: -78px;

        .cursor-default {
          cursor: default;
        }
      }
    }

    p {
      padding-bottom: 14px;
      line-height: 21px;
    }

    .police-badge {
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }
  }
</style>
