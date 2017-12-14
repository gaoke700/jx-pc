export function getQueryParams(str) { // eslint-disable-line
  const result = {};
  (str || document.location.search)
    .replace(/(^\?)/, '')
    .split('&')
    .forEach((item) => {
      const [key, val] = item.split('=');
      result[key] = val;
    });
  return result;
}

// 重新加载页面时跳转指定锚点
export function scrollAnchor(anchor) {
  if (window.location.hash === `#${anchor}`) {
    window.location.hash = '';
    window.location.hash = `#${anchor}`;
  }
}
