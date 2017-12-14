/**
 * 图片上传
 */

import Vue from 'vue';

export default {
  /**
   * 增
   * @returns {Promise}
   * @param {Blob} files - 参数是一个Blob对象
   * @param {String} siteId - 店铺id
   */
  postData(files, siteId) {
    return new Promise((resolve, reject) => {
      if ({}.toString.call(files).toLocaleLowerCase().slice(8, -1) !== 'filelist') {
        reject('第一参数错误, files必须是一个Blob对象');
        return;
      }
      if (siteId === undefined) {
        reject('缺少第二参数, siteId必须是一个店铺的id');
        return;
      }
      const imgArr = [];
      let num = 0;
      Object.keys(files).forEach((key) => {
        const v = files[key];
        const reader = new FileReader();
        reader.addEventListener('load', (ev) => {
          num += 1;
          imgArr.push({
            name: v.name,
            data: ev.target.result.split(',')[1],
          });
          if (num === files.length) {
            Vue.axios.post('img/upload', {
              site_id: siteId,
              imgs: JSON.stringify(imgArr),
            }).then((result) => {
              resolve(result.data || []);
            }).catch((error) => {
              reject(error);
            });
          }
        }, false);
        reader.readAsDataURL(v);
      });
    });
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
    return Vue.axios.post('', params);
  },
};
