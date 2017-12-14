import Vue from 'vue';

export default {
  get(params = {}) {
    return Vue.axios.post('platform/adv_get', Object.assign({ type: 'jx_c_login' }, params)).then(res => (res.data || {}));
  },
};
