/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
