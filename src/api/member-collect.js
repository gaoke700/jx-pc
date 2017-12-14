import Vue from 'vue';

export default {
  getCollectList(params = {}) {
    return Vue.axios.post('member/favorite_list', params).then(res => (res.data || {}));
  },
  // 添加/取消
  updateCollect(params = {}) {
    return Vue.axios.post('member/favorite_update', params).then(res => (res.data || {}));
  },
  // 批量添加/取消
  batchUpdate(params = {}) {
    return Vue.axios.post('member/favorite_batchupdate', params).then(res => (res.data || {}));
  },
};
