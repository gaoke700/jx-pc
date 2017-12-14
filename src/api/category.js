import Vue from 'vue';

export default {
  getList(params = {}) {
    return Vue.axios.post('goodscat/store_list', params).then(res => (res.data || {}));
  },
};
