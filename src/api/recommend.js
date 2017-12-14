import Vue from 'vue';

export default {
  getList(params = {}) {
    return Vue.axios.post('goods/recomm_list', params);
  },
};
