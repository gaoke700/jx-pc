import indexModule from '../api/index-module';
import ApiStore from '../api/store';
import ApiCarts from '../api/carts';
import * as types from './mutation-types';

/* eslint-disable Assignment to function parameter 'state' */
export default {
  getIndexModule({ commit, state }) {
    if (state.indexModuleState <= 1) {
      commit(types.INDEX_MODULE_STATE, 4);
      indexModule.indexModule().then((res) => {
        commit(types.INDEX_MODULE, { res });
      });
    }
  },
  getStoreInfo({ commit }) {
    return ApiStore.getStoreInfo().then((res) => {
      commit(types.STORE_INFO, { res });
    });
  },
  getCartsList({ commit, state }) {
    if (window.location.pathname.indexOf('login.html') < 0) {
      const carts = JSON.parse(localStorage.getItem('jxCarts') || '{}');
      carts.carts = carts.carts || [];
      if (carts.carts.length > 0 && state.userInfo.unionid) {
        ApiCarts.add({
          data: {
            site_id: (carts.site_id || ''),
            carts: carts.carts,
          },
        }).then(() => {
          localStorage.removeItem('jxCarts');
          ApiCarts.getList().then((res) => {
            commit(types.GET_CARTS_LIST, { res });
          });
        });
      } else if (state.userInfo.unionid) {
        ApiCarts.getList().then((res) => {
          commit(types.GET_CARTS_LIST, { res });
        });
      } else if (carts.carts.length > 0) {
        const offlineCarts = {};
        offlineCarts[carts.site_id || ''] = carts.carts;
        ApiCarts.getOfflineList({
          offline_carts: offlineCarts,
        }).then((res) => {
          commit(types.GET_CARTS_LIST, { res });
        });
      } else {
        const res = {
          count_cart: 0,
          product: [],
          site_id: '',
          total_proce: '0.00',
        };
        commit(types.GET_CARTS_LIST, { res });
      }
    }
  },
};
