import Vue from 'vue';

export default {
  getMemberList(params = {}) {
    return Vue.axios.post('member/card_list', params).then(res => (res.data || {}));
  },
};
