import Vue from 'vue';

const MODULE_NAME = 'orders';

export default {
  // 订单确认
  checkout(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/checkout`, params).then(res => res.data);
  },

  // 创建订单
  add(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/add`, params).then(res => res.data);
  },

  // 确认创建的订单是否成功
  confirm(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/confirm`, params).then(res => res.data);
  },
};
