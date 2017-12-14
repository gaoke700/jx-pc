import Vue from 'vue';
import store from '../store';
import Utils from '../utils/utils';

export default {
  getList(params = {}) {
    return Vue.axios.post('carts/list', params).then((res) => {
      let data = res.data || {};
      data = data.carts || {};
      Object.keys(data).forEach((item) => {
        data = data[item].carts || {};
        data = Object.assign({
          count_cart: 0,
          final_amount: '0.00',
          product: [],
          total_price: '0.00',
        }, data);
        data.site_id = item;
      });
      return data;
    });
  },
  getOfflineList(params = {}) {
    if (params.offline_carts) {
      params.offline_carts = JSON.stringify(params.offline_carts); // eslint-disable-line
    }
    return Vue.axios.post('carts/offline_list', params).then((res) => {
      let data = res.data || {};
      data = data.carts || {};
      Object.keys(data).forEach((item) => {
        data = data[item].carts || {};
        data.site_id = item;
      });
      return data;
    });
  },
  add(params = {}) {
    const unionid = store.state.userInfo.unionid || '';
    if (unionid) {
      if (params.data) {
        const data = params.data;
        delete params.data; // eslint-disable-line
        params.data = JSON.stringify([data]); // eslint-disable-line
      }
      return Vue.axios.post('carts/add', params).then(res => (res.data || {}));
    }

    return Promise.resolve().then(() => {
      const data = params.data;
      const carts = JSON.parse(localStorage.getItem('jxCarts') || '{}');
      carts.site_id = data.site_id || '';
      carts.carts = carts.carts || [];
      (data.carts || []).forEach((item) => {
        const index = Utils.arrayFindkey(carts.carts, 'product_id', (item.product_id || ''));
        if (index > -1) {
          carts.carts[index].product_num = item.product_num + (carts.carts[index].product_num || 0);
        } else {
          carts.carts.push(item);
        }
      });
      localStorage.setItem('jxCarts', JSON.stringify(carts));
      return [];
    });
  },
  del(params = {}) {
    const unionid = store.state.userInfo.unionid || '';
    if (unionid) {
      if (params.data) {
        const data = params.data;
        delete params.data; // eslint-disable-line
        params.data = JSON.stringify(data); // eslint-disable-line
      }
      return Vue.axios.post('carts/edit', params).then(res => (res.data || {}));
    }
    return Promise.resolve().then(() => {
      const carts = JSON.parse(localStorage.getItem('jxCarts') || '{}');
      carts.carts = carts.carts || []; // eslint-disable-line
      params.data = params.data || []; // eslint-disable-line
      params.data.forEach((item) => {
        (item.p || []).forEach((n) => {
          const index = Utils.arrayFindkey(carts.carts, 'product_id', (n.product_id || ''));
          console.log(n.product_id, index);
          if (index > -1) {
            if (params.type === 'del') {
              carts.carts.splice(index, 1);
            } else if (params.type === 'up') {
              carts.carts[index].product_num = n.product_num;
            }
          }
        });
      });
      if (carts.carts.length <= 0) {
        localStorage.removeItem('jxCarts');
      } else {
        localStorage.setItem('jxCarts', JSON.stringify(carts));
      }
      return [];
    });
  },
  // 这个是给结算页用的
  getCartListInfo() {
    let cartListInfo;
    try {
      cartListInfo = JSON.parse(localStorage.cartListInfo);
    } catch (e) {
      cartListInfo = [];
    }
    return cartListInfo;
  },
};
