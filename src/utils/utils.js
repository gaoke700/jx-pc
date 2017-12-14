/* eslint-disable */
var utils = {
  parseUrl: function (str) {
    var arr, part, url = {};
    if (!(str || '').replace(/^\s+|\s+$/, '')) {
      return {};
    }
    str = str.substring(1, str.length);
    if (str) {
      arr = str.split('&');
      for (let i = 0; i < arr.length; i++) {
        part = arr[i].split('=');
        url[part[0]] = part[1];
      }
    }
    return url;
  },
  getUrlObj: function () {
    return this.parseUrl(location.search || location.hash);
  },
  arrayFindkey: function (arr, key, value) {
    if (!(arr && arr instanceof Array && key)) return false;
    var index = -1;
    for (var i = 0; i < arr.length; i++) {
      if (value) {
        if (arr[i][key] == value) {
          index = i;
        }
      } else {
        if (arr[i] == key) {
          index = i;
        }
      }
    }
    return index;
  },
  getHost: function () {
    let host = window.location.host;
    const index = host.indexOf(window.HOSTNAME);
    return (`http://${host.substring(0,index)}.m${host.substring(index)}`);
  },
  isPc: function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  },
  isShop: function() {
    let isShop = true;
    if (window.FRONT_MODE !== 'shop') {
      isShop = false;
    }
    return isShop;

  },
};
export default utils;
