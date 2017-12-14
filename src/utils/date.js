// https://github.com/ustbhuangyi/vue-sell/blob/master/src/common/js/date.js
function padLeftZero(str) {
  return (`00${str}`).substr(str.length);
}

export function formatDate(date, fmt) { // eslint-disable-line
  let result = fmt;
  if (/(Y+)/.test(result)) {
    result = result.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }

  const weeks2 = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weeks3 = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    dd: weeks2[date.getDay()],
    ddd: weeks3[date.getDay()],
  };

  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(result)) {
      const str = `${o[k]}`;
      result = result.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  });

  return result;
}

