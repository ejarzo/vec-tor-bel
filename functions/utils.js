const fetch = require('node-fetch');

const URLS = {
  YOUTUBE_VIDEOS: 'https://www.googleapis.com/youtube/v3/search/',
  YOUTUBE_COMMENTS: 'https://www.googleapis.com/youtube/v3/commentThreads/',
  FREESOUNDS: 'https://freesound.org/apiv2/search/text/',
  CLEVERBOT: 'https://www.cleverbot.com/getreply',
  NEWS: 'https://newsapi.org/v2/top-headlines/',
};

const fetchApi = async (url, params) => {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  const response = await fetch(`${url}?${query}`);
  return response.json();
};

module.exports = { URLS, fetchApi };
