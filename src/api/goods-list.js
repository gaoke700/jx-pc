import Vue from 'vue';

export default {
  getGoodsList(params = {}) {
    return Vue.axios.post('goods/goods_list', { data: JSON.stringify(params) }).then(res => res.data);
  },
};
