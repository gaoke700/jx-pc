import Vue from 'vue';

const MODULE_NAME = 'memberOrder';

export default {
  // 我的订单列表
  getList(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/orderList`, params).then(res => res.data);
  },

  // 我的订单详情
  getDetail(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/orderDetail`, params).then(res => res.data);
  },

  // 订单确认收货/取消
  stateModify(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/orderStateModify`, params).then(res => res.data);
  },

  // 获取订单物流信息
  getDelivery(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/orderDelivery`, params).then(res => res.data);
  },

  // 获取我的退款订单列表
  getRefundOrderList(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/getRefundOrderList`, params).then(res => res.data || []);
  },

  // 提交申请退款页面
  getOrderRefund(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/orderRefundPage`, params).then(res => res.data);
  },

  // 订单申请退款接口和修改退款信息
  postOrderRefund(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/orderRefundPost`, params).then(res => res.data);
  },

  // 获取我的退款订单详情
  getRefundOrderInfo(params) {
    return Vue.axios.post(`${MODULE_NAME}/orderRefundInfo`, params).then(res => (res.data || {}));
  },

  // 撤销申请、修改申请
  postRefundRepeal(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/orderRefundStatus`, params).then(res => res.data);
  },

  // 退货退款单物流信息提交
  postRefundLogistics(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/refundLogisticsPost`, params).then(res => res.data);
  },

  // 退货退款单--协商记录
  getRefundLog(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/orderRefundLog`, params).then(res => res.data);
  },
};
