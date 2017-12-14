import Vue from 'vue';

export default {
  getStatus(params = {}) {
    return Vue.axios.post('payment/checkout', params);
  },
};
