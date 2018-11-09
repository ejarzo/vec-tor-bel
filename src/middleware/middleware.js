import { getRandomIn } from 'utils/data';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const FREESOUND_API_KEY = process.env.REACT_APP_FREESOUND_API_KEY;
const CLEVERBOT_API_KEY = process.env.REACT_APP_CLEVERBOT_API_KEY;
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const LANGUAGE_LAYER_API_KEY = process.env.REACT_APP_LANGUAGE_LAYER_API_KEY;

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
        console.log(data);
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

export const getYoutubeVideo = async query => {
  const videos = await getYoutubeVideos(query).catch(error => {
    console.log('error getting videos');
    console.log(error);
    return [];
  });

  if (videos.length > 0) {
    const randomVideo = getRandomIn(videos);
    console.log('RANDOM VIDEO:', randomVideo);
    return {
      videoId: randomVideo.id.videoId,
      videoAuthor: randomVideo.snippet.channelTitle,
      videoTitle: randomVideo.snippet.title,
    };
  }

  return '';
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

export const fetchFreesoundResults = (query, { min = 0, max = 200 } = {}) => {
  console.log('FETCHING SOUND', query);
  console.log('min:', min, 'max:', max);
  const url = 'https://freesound.org/apiv2/search/text/';
  const params = {
    token: FREESOUND_API_KEY,
    page_size: 50,
    query: query,
    fields: 'name,previews,username',
    filter: `duration:[${min} TO ${max}]`,
  };

  return fetchApi(url, params);
};

const excludeList = ['JohnLaVine333', 'SoundMaster391', 'Timbre'];

export const getFreesounds = (query, minMax) => {
  return new Promise((resolve, reject) => {
    fetchFreesoundResults(query, minMax).then(
      ({ results }) => {
        if (results && results.length > 0) {
          console.log('SOUND RESULTS', results);
          resolve(
            results.filter(
              ({ name, username }) =>
                excludeList.indexOf(username) === -1 &&
                !name.includes('horror cries')
            )
          );
        } else {
          // resolve([]);
          reject(`No sounds for "${query}"`);
        }
      },
      error => {
        reject(error);
      }
    );
  });
};

export const getSoundUrl = async (query, minMax) => {
  console.log('getsoundurl', query, minMax);
  const freeSounds = await getFreesounds(query, minMax).catch(error => {
    console.log('get sounds error:', error);
  });

  if (!freeSounds)
    return {
      // soundUrl: '',
      // soundAuthor: '',
    };
  const sound = getRandomIn(freeSounds);
  return {
    soundUrl: sound.previews['preview-lq-mp3'],
    soundAuthor: sound.username,
  };
};

export const getCleverbotReply = (query, cs) => {
  const url = 'https://www.cleverbot.com/getreply';
  const params = {
    key: CLEVERBOT_API_KEY,
    input: query,
    // cs: cs,
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

export const getCensored = text => {
  const url = 'https://www.purgomalum.com/service/json';
  const params = {
    text: text,
    // fill_char: ''
  };

  return fetchApi(url, params);
};

export const getLanguage = async query => {
  const url = 'http://apilayer.net/api/detect';
  const params = {
    access_key: LANGUAGE_LAYER_API_KEY,
    query: query,
  };
  try {
    const { results } = await fetchApi(url, params);
    const firstResult = results[0];
    return firstResult;
  } catch (error) {
    return 'en';
  }
};
