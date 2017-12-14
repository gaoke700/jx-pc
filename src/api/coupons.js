import Vue from 'vue';

export default {
  getCouponList(params = {}) {
    return Vue.axios.post('coupon/coupon_list', Object.assign({
      status: 0,
    }, params)).then(res => (res.data || {}));
  },
};
