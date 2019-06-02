const fetch = require('node-fetch');

const fetchApi = async (url, params) => {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  const response = await fetch(`${url}?${query}`);
  return response.json();
};

module.exports = { fetchApi };
