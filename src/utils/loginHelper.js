import VueCookie from 'vue-cookie';

const { hostname } = window.location;

const helper = {
  getUserInfo() {
    return JSON.parse(decodeURIComponent(VueCookie.get('userInfo') || '{}'));
  },
  isLocal() {
    return hostname === 'localhost' || /192\.168\.\d+.\d+/.test(hostname);
  },
  isLogin() {
    const { unionid, utoken } = this.getUserInfo();
    if (!unionid || !utoken) {
      return false;
    }
    return true;
  },
};

export default helper;
