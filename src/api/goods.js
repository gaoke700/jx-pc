import Vue from 'vue';

export default {
  getInfo(data = {}) {
    return Vue.axios.post('goods/goods_info', data);
  },
  commentList(params = {}) {
    return Vue.axios.post('goods/comment_list', params).then(res => res.data);
  },
  getIntro(params = {}) {
    return Vue.axios.post('goods/goods_intro', params);
  },
};
