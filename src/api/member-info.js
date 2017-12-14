import Vue from 'vue';

export default {
  getMemberInfo(params = {}) {
    return Vue.axios.post('member/member_info', params).then(res => (res.data || {}));
  },

  getPicVerify(params = {}) {
    return Vue.axios.post('member/captcha_send', params).then(res => (res.data || {}));
  },

  getMsgVerify(params = {}) {
    return Vue.axios.post('member/mobile_send', params);
  },

  saveMobile(params = {}) {
    return Vue.axios.post('member/mobile_save', params).then(res => (res.data || {}));
  },

  saveMemberInfo(params = {}) {
    return Vue.axios.post('member/member_info_save', params).then(res => (res.data || {}));
  },
};
