export function handleResponse(res) { // eslint-disable-line
  let data = res.data || {};
  if (data.res === 'success') {
    data = data.data || {};
  }
  return data;
}
