import axios from 'axios';
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import Qs from 'qs';
import number from '../api/number';
import cfg from './config';
import { getApiSign, encryptObject, decrypt } from '../utils/crypto';

Vue.use(VueCookie);

const { unionid, utoken } = number.getUserInfo();

const defaultOpts = {
  timestamp: new Date().getTime(),
  href: window.location.href,
  api_mode: 'pc',
  unionid,
  utoken,
};

// https://github.com/mzabriskie/axios#request-config
const config = {
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  baseURL: (window.BASEURL || ''),

  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [function transformRequest(data) {
    // Do whatever you want to transform the data
    if (!data) {
      data = {}; // eslint-disable-line
    }

    const mergeData = {
      ...data,
      ...defaultOpts,
    };

    if (cfg.ENABLE_ENCRYPT) {
      // console.log(JSON.stringify(mergeData));
      const encryptedData = encryptObject(mergeData);
      // console.log(JSON.stringify(encryptedData));
      return Qs.stringify({
        ...encryptedData,
        ac: getApiSign(encryptedData, cfg.AC_KEY),
      });
    }

    return Qs.stringify({
      ...mergeData,
      ac: getApiSign(mergeData, cfg.AC_KEY),
    });
  }],

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function transformResponse(data) {
    // TODO: 30001 店铺未装修 跳转指定页面
    function errHandler({ data: d, errCode, errMsg }) {
      switch (errCode) {
        case 10011: // 域名错误跳转
          window.location.href = d.href;
          break;
        case 10012: // 店铺不存在
        case 50001: // 商品不存在
          if (window.location.pathname.indexOf('error.html') <= -1) {
            window.location.href = 'error.html?errCode=400';
          }
          break;
        case 10004: // 非法查询
          if (window.location.pathname.indexOf('error.html') <= -1) {
            window.location.href = 'error.html?errCode=10004';
          }
          break;
        case 80001: // 用户未登录
          VueCookie.delete('userInfo', { domain: window.HOSTNAME });
          window.location.href = 'login.html';
          break;
        default:
          console.log(`errCode: ${errCode}, errMsg: ${errMsg}`);
      }
    }

    // Do whatever you want to transform the data
    if (data) {
      if (data.res === 'success') {
        if (cfg.ENABLE_ENCRYPT) {
          let result = {};
          let decodeData;
          const decryptData = decrypt(data.data, (utoken || cfg.ENCRYPT_KEY));
          try {
            decodeData = decodeURIComponent(decryptData);
          } catch (err) {
            if (err.message === 'URI malformed') {
              decodeData = decodeURIComponent(encodeURIComponent(decryptData));
            }
          }
          result = JSON.parse(decodeData || '{}');
          // console.log(`--->[ ${decryptData} ] <---`);
          console.log(result);
          return result;
        }

        return data.data;
      }

      // res === 'fail'
      errHandler(data);
    }

    return {};
  }],

  // `responseType` indicates the type of data that the server will respond with
  // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
};

const instance = axios.create(config);

// 异常处理拦截器：发生错误时，错误信息将由catch捕捉
instance.interceptors.response.use((data) => {
  const response = data.request.response;
  if (response.res === 'success') {
    return data;
  }

  return Promise.reject(response);
}, error => Promise.reject(error));

export default instance;
