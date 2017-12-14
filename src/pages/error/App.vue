<template>
  <div class="page-error">
    <layout-all>
      <div slot="shop-header"></div>
      <div slot="menu-bar"></div>
      <div slot="page-content">
        <div class="error-content">
          <div class="container">
            <img src="~assets/images/common/404.png" alt="404" v-if="errCode === '400'">
            <img src="~assets/images/common/500.png" alt="500" v-if="errCode === '500'">
            <div v-if="errCode === '10004'">
              <img src="~assets/images/common/10004.png" alt="10004" >
              <div class="tc f18 pt40">非法访问！<a class="pointer" href="index.html">点击返回首页</a></div>
            </div>
            <p v-if="errCode !== '10004'">抱歉！出现错误啦</p>
          </div>
        </div>
      </div>
    </layout-all>
  </div>
</template>

<script>
  import LayoutAll from '../layout/LayoutAll';
  import { getQueryParams } from '../../utils/queryStr';

  export default {
    data() {
      return {
        errCode: '',
      };
    },

    components: {
      LayoutAll,
    },

    created() {
      this.errCode = getQueryParams().errCode || '400';
    },
  };
</script>

<style lang="scss">
  .error-content {
    height: 740px;
    color: #888888;
    text-align: center;

    > .container {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }

    p {
      font-size: 18px;
      line-height: 3em;
      margin-top: 30px;
    }
  }
</style>
