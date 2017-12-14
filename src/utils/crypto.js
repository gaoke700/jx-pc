import CryptoJS from 'crypto-js';
import md5 from './md5';
import config from '../common/config';

function isUndefined(value) {
  return value === undefined;
}

function isNull(value) {
  return value === null;
}

// 加密
export function encrypt(value) {
  const key = CryptoJS.enc.Utf8.parse(config.ENCRYPT_KEY);
  const iv = CryptoJS.enc.Utf8.parse(config.ENCRYPT_IV);
  let val = '';

  if (typeof value === 'object') {
    val = JSON.stringify(value);
  } else {
    val = value.toString();
  }

  const encryptBlock = CryptoJS.AES.encrypt(val, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encryptBlock.toString();
}

// 解密
export function decrypt(value, ENCRYPT_KEY = config.ENCRYPT_KEY) {
  if (!value.length) return value;

  const key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY);
  const iv = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY.slice(0, 16));

  const decryptBlock = CryptoJS.AES.decrypt(value, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return CryptoJS.enc.Utf8.stringify(decryptBlock);
}

// 遍历对象并对值加密
export function encryptObject(obj) {
  const result = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value) {
      result[key] = encrypt(value);
    }
  });
  return result;
}

// 生成ac签名
export function getApiSign(params, token) {
  const str = Object.keys(params)
    .filter(k => !isNull(params[k]) && !isUndefined(params[k]))
    .sort()
    .map(k => params[k])
    .reduce((prev, curr) => prev + curr, '')
    .concat(token);
  return md5.hexMd5(str).toLowerCase();
}
