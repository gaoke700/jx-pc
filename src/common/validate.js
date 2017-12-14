export default {
  falsely(value, cb, msg) {
    if (value === '') cb(new Error(msg));
  },
  mobile(value, cb, msg = '请输入正确的手机号') {
    if (!/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
      cb(new Error(msg));
    }
  },
};
