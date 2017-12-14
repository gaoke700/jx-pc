<template>
  <div class="page-index">
    <layout-all>
      <div slot="page-content">
        <page-content></page-content>
      </div>
    </layout-all>
  </div>
</template>

<script>
  import LayoutAll from '../layout/LayoutAll';
  import PageContent from './Content';

  export default {
    components: {
      LayoutAll,
      PageContent,
    },
    data() {
      return {
      };
    },
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../styles/theme";

  .ui-carousel__item img {
    width: 100%;
  }
</style>
