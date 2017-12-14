import Vue from 'vue';
import VueAxios from 'vue-axios';
import store from 'store';
import VueCookie from 'vue-cookie';
import VueLazyload from 'vue-lazyload';
import {
  Button,
  Dialog,
  MessageBox,
  Radio,
  RadioButton,
  RadioGroup,
  Form,
  FormItem,
  Select,
  Option,
  Input,
  Loading,
  Scrollbar,
  Popover,
  Pagination,
} from 'element-ui';
import Message from 'components/message';
import Upload from 'components/Upload';
import axios from '@/common/axios';
import notification from 'components/dialog/notification';
import * as filters from '../../filters';

Vue.use(Button);
Vue.use(Dialog);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Scrollbar);
Vue.use(Popover);
Vue.use(Pagination);
Vue.use(Loading.directive);
Vue.component('notification', notification);
Vue.component(Upload.name, Upload);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.use(VueCookie);
Vue.use(VueAxios, axios);
Vue.use(VueLazyload);

Vue.config.productionTip = false;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 京选统计
const script = document.createElement('script');
script.src = 'http://s.shopex.cn/html/tj.js';
document.body.appendChild(script);

export default function (App) {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    render: h => h(App),
  });
}
