import { formatDate } from '../utils/date';

// TODO http://www.jianshu.com/p/849b0ae36b36 解决toFixed精度问题
export function money(value) { // eslint-disable-line
  if (value === undefined) return '0.00';
  return (+value || 0).toFixed(2);
}

// 日期格式化
export function dateFormat(value, fmt = 'YYYY-MM-DD HH:mm') {
  if (!value || value === '0') return '';

  // 日期对象
  if (value instanceof Date) return formatDate(value, fmt);

  let date;
  // 时间戳
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    // 将秒时间戳转为毫秒 如 "1505291128"
    if (value.length === 10) {
      date = new Date(+value * 1000);
    } else {
      date = new Date(+value);
    }

    return formatDate(date, fmt);
  }

  // 时间字符串 如 2017-09-19
  return formatDate(new Date(value), fmt);
}
