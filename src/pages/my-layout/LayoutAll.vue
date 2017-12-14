<template>
  <layout-all>
    <!--<div slot="site-header"></div>-->
    <div slot="shop-header"></div>
    <div slot="menu-bar"></div>
    <div slot="toolbar"></div>
    <div slot="page-content">
      <div class="personal-center">
<!--
        <slot name="my-header">
          <my-header></my-header>
        </slot>
-->
        <slot name="my-toolbar">
          <toolbar></toolbar>
        </slot>
        <div class="content-wrap container g-clearfix">
          <slot name="my-menu">
            <my-menu :current-url="currentUrl"></my-menu>
          </slot>
          <div class="main-content pb20">
            <slot></slot>
          </div>
          <slot name="my-container"></slot>
        </div>
      </div>
    </div>
  </layout-all>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { USER_INFO } from 'store/mutation-types';
  import LayoutAll from '../layout/LayoutAll';
  import MyHeader from './MyHeader';
  import MyMenu from './MyMenu';
  import MyFooter from './MyFooter';
  import Toolbar from '../layout/Toolbar.vue';

  export default {
    components: {
      LayoutAll,
      Toolbar,
      MyHeader,
      MyMenu,
      MyFooter,
    },

    props: {
      currentUrl: {
        type: String,
        default: '',
      },
    },

    computed: {
      ...mapGetters(['userInfo']),
    },

    methods: {
      ...mapMutations({
        getUserInfo: USER_INFO,
      }),
    },

    created() {
      this.getUserInfo();

      const { unionid } = this.userInfo;
      if (!unionid) {
        window.location.href = 'login.html?login=true';
      }
    },
  };
</script>

<style lang="scss">
  $content-width: 1200px;
  $menu-width: 112px;

  .personal-center {
    background-color: #f7f7f7;

    .site-top .container {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .content-wrap {
      padding-top: 20px;
    }

    .main-content {
      width: $content-width - $menu-width;
      margin-left: $menu-width;
      overflow: hidden;
    }
  }
</style>
