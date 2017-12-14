/**
 * 订单评论
 */

import Vue from 'vue';

export default {
  /**
   * 增
   * @returns {Promise}
   * @param {Object} params - 参数是一个对象
   * @param {Array} params.data - 数据集合
   * @param {String} params.data[].site_id - 店铺id
   * @param {String} params.data[].textArea - 评论内容
   * @param {String} params.data[].order_id - 订单id
   * @param {String} params.data[].item_id -
   * @param {String} params.data[].starLen - 星星
   * @param {String} params.data[].nameNum -
   * @param {String} params.data[].imageIds - 商品数组 ['899','1231']
   */
  postData(params = {}) {
    return Vue.axios.post('memberOrder/saveComment', params).then(res => res.data);
  },
  /**
   * 删
   * @returns {Promise}
   */
  deleteData(params = {}) {
    return Vue.axios.post('', params);
  },
  /**
   * 改
   * @returns {Promise}
   */
  putData(params = {}) {
    return Vue.axios.post('', params);
  },
  /**
   * 查
   * @returns {Promise}
   */
  getData(params = {}) {
    return Vue.axios.post('memberOrder/getCommentList', params).then(res => res.data || []);
  },
};
