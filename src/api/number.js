import Vue from 'vue';

const MODULE_NAME = 'member';

export default {
  // 收货地址列表
  getAddressList(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/address_list`, params).then(res => res.data);
  },

  // 设置默认收货地址
  setDefaultAddress(id) {
    return Vue.axios.post(`${MODULE_NAME}/default_address`, { id }).then(res => res.data);
  },

  // 删除收货地址
  removeAddress(id) {
    return Vue.axios.post(`${MODULE_NAME}/delete_address`, { id }).then(res => res.data);
  },

  // 添加或更新收货地址
  addOrUpdateAddress(params = {}) {
    return Vue.axios.post(`${MODULE_NAME}/add_address`, params).then(res => res.data);
  },

  // 获取用户登录信息
  getUserInfo() {
    return JSON.parse(decodeURIComponent(Vue.cookie.get('userInfo') || '{}'));
  },
};
