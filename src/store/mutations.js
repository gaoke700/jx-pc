import VueCookie from 'vue-cookie';
import * as types from './mutation-types';

/* eslint-disable no-param-reassign */
export default {
  [types.INDEX_MODULE](state, { res }) {
    state.indexModule = res;
  },
  [types.INDEX_MODULE_STATE](state) {
    state.indexModuleState = 4;
  },
  [types.USER_INFO](state) {
    const userInfo = JSON.parse(decodeURIComponent(VueCookie.get('userInfo')) || '{}');
    if (userInfo) {
      state.userInfo = Object.assign(state.userInfo, userInfo);
    }
  },
  [types.GET_CARTS_LIST](state, { res }) {
    state.getCartsList = Object.assign(state.getCartsList, res);
  },
  [types.STORE_INFO](state, { res }) {
    state.storeInfo = Object.assign(state.storeInfo, res);
  },
};
