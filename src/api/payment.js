import Vue from 'vue';

export default {
  payCode(params = {}) {
    return Vue.axios.post('payment/getpaycode', params).then(res => res.data);
  },

  payTeegon(params = {}) {
    return Vue.axios.post('payment/charge_info', params).then(res => res.data);
  },
};
