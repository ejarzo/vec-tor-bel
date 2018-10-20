const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const FREESOUND_API_KEY = process.env.REACT_APP_FREESOUND_API_KEY;
const CLEVERBOT_API_KEY = process.env.REACT_APP_CLEVERBOT_API_KEY;
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const fetchApi = async (url, params) => {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  const response = await fetch(`${url}?${query}`);
  return response.json();
};

const fetchYoutubeResults = query => {
  const url = 'https://www.googleapis.com/youtube/v3/search/';
  const params = {
    key: YOUTUBE_API_KEY,
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: 15,
  };

  return fetchApi(url, params);
};

export const getYoutubeVideos = query => {
  return new Promise((resolve, reject) => {
    fetchYoutubeResults(query).then(
      data => {
        const { items } = data;
        if (items.length > 0) {
          resolve(items);
        } else {
          reject('No Videos');
        }
      },
      error => {
        reject(error);
      }
    );
  });
};

const fetchYoutubeComments = videoId => {
  const url = 'https://www.googleapis.com/youtube/v3/commentThreads/';
  const params = {
    key: YOUTUBE_API_KEY,
    videoId,
    part: 'snippet',
    textFormat: 'plainText',
    order: 'relevance',
    maxResults: 5,
  };

  return fetchApi(url, params);
};

export const getYoutubeComments = videoId => {
  return new Promise((resolve, reject) => {
    fetchYoutubeComments(videoId).then(
      data => {
        const { items } = data;
        if (items && items.length > 0) {
          const videoComments = items.map(item => ({
            id: item.id,
            author: item.snippet.topLevelComment.snippet.authorDisplayName,
            text: item.snippet.topLevelComment.snippet.textDisplay,
          }));
          resolve(videoComments);
        } else {
          reject('No Comments');
        }
      },
      error => {
        reject(error);
      }
    );
  });
};

export const fetchFreesoundResults = query => {
  const url = 'https://freesound.org/apiv2/search/text/';
  const params = {
    token: FREESOUND_API_KEY,
    query: query,
    fields: 'name,previews',
  };

  return fetchApi(url, params);
};

export const getFreesounds = query => {
  return new Promise((resolve, reject) => {
    fetchFreesoundResults(query).then(
      ({ results }) => {
        if (results.length > 0) {
          resolve(results);
        } else {
          reject(`No sounds for "${query}"`);
        }
      },
      error => {
        reject(error);
      }
    );
  });
};

export const getCleverbotReply = (query, cs) => {
  const url = 'https://www.cleverbot.com/getreply';
  const params = {
    key: CLEVERBOT_API_KEY,
    input: query,
    cs: cs,
    // interaction_count: prevInteractionCount,
    cb_settings_emotion: 'yes',
    // cb_settings_tweak1: 50,
    // cb_settings_tweak2: 50,
  };

  return fetchApi(url, params);
};

export const getNews = () => {
  const url = 'https://newsapi.org/v2/top-headlines/';
  const params = {
    country: 'us',
    apiKey: NEWS_API_KEY,
  };

  return fetchApi(url, params);
};