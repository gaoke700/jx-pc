<template>
  <div>
    <slot name="site-top">
      <site-top></site-top>
    </slot>
    <slot name="site-header">
      <site-header></site-header>
    </slot>
    <slot name="shop-header">
      <shop-header></shop-header>
    </slot>
    <slot name="menu-bar">
      <menu-bar></menu-bar>
    </slot>
    <slot name="toolbar">
      <toolbar></toolbar>
    </slot>
    <slot name="page-content"></slot>
    <slot name="site-footer">
      <site-footer v-if="storeInfo.foot_copyright"></site-footer>
    </slot>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import SiteTop from '../layout/SiteTop';
  import SiteHeader from '../layout/SiteHeader';
  import ShopHeader from '../layout/ShopHeader';
  import MenuBar from '../layout/MenuBar';
  import SiteFooter from '../layout/SiteFooter';
  import Toolbar from '../layout/Toolbar';
  import { switchMobileUrl } from '../../utils/switchMboileUrl';
  import Utils from '../../utils/utils';

  export default {
    components: {
      SiteTop,
      SiteHeader,
      ShopHeader,
      MenuBar,
      SiteFooter,
      Toolbar,
    },

    computed: {
      ...mapState(['userInfo', 'storeInfo']),
    },

    beforeCreate() {
      if (!Utils.isPc()) {
        window.location.href = switchMobileUrl();
      }
    },

    methods: {
      getUserInfo() {
        this.$store.commit('USER_INFO');
      },
      ...mapActions(['getCartsList', 'getStoreInfo']),
    },

    created() {
      this.getUserInfo();
      this.getCartsList();
      this.getStoreInfo().then(() => {
        const storeName = this.storeInfo.store_name || '';
        if (storeName && Utils.isShop()) {
          window.document.title = storeName;
        }
      });
    },
  };
</script>

