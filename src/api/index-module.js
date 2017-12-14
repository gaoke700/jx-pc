import Vue from 'vue';

export default {
  indexModule(params = {}) {
    return Vue.axios.post('jx/setting_info', params).then(({ data }) => (data.data || {}));
  },
};
