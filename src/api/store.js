import Vue from 'vue';

export default {
  getList(params = {}) {
    return Vue.axios.post('goodscat/store_list', params);
  },

  getStoreInfo(params = {}) {
    return Vue.axios.post('supplier/info', params).then(res => (res.data || {}));
  },

  getStoreCert(params = {}) {
    return Vue.axios.post('supplier/cert', params).then(res => (res.data || {}));
  },

  getRegionList(params = {}) {
    return Vue.axios.post('store/region_list', params).then(res => res.data);
  },
};
