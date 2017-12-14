// 避免回退到别的域
export function goBack() { // eslint-disable-line
  const referrer = document.referrer;
  // 'https://'.length === 8
  const prevPage = referrer.substr(0, referrer.indexOf('/', 8));
  if (prevPage !== window.location.origin) {
    window.location.href = 'index.html';
  } else {
    history.back();
  }
}
