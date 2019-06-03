import { getRandomIn } from 'utils/data';
import {
  fetchYoutubeResults,
  fetchYoutubeComments,
  fetchFreesoundResults,
  getCleverbotReply,
  getNews,
} from './middleware-netlify';

export const getYoutubeVideos = async query => {
  const { items } = await fetchYoutubeResults(query);
  if (items && items.length > 0) {
    return items;
  } else {
    console.log('no videos');
    return [];
  }
};

export const getYoutubeVideo = async query => {
  console.log('FETCHING VIDEOS');

  const videos = await getYoutubeVideos(query).catch(error => {
    console.log('error getting videos');
    console.log(error);
    return [];
  });

  if (videos.length > 0) {
    const randomVideo = getRandomIn(videos);
    // console.log('RANDOM VIDEO:', randomVideo);
    return {
      videoId: randomVideo.id.videoId,
      videoAuthor: randomVideo.snippet.channelTitle,
      videoTitle: randomVideo.snippet.title,
    };
  }

  return '';
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

const excludeList = ['JohnLaVine333', 'SoundMaster391', 'Timbre', '11linda'];

export const getFreesounds = async (query, minMax) => {
  const result = await fetchFreesoundResults(query, minMax);
  const { sounds } = result || {};
  if (sounds && sounds.length > 0) {
    return sounds.filter(
      ({ name, username }) =>
        excludeList.indexOf(username) === -1 && !name.includes('horror cries')
    );
  } else {
    console.log(`No sounds for "${query}"`);
    return [];
  }
};

export const getSoundUrl = async (query, minMax) => {
  const freeSounds = await getFreesounds(query, minMax).catch(error => {
    // console.log('get sounds error:', error);
  });

  if (!freeSounds || freeSounds.length === 0)
    return {
      soundUrl: '',
      soundAuthor: '',
    };
  const sound = getRandomIn(freeSounds);
  if (!sound) {
    return {
      soundUrl: '',
      soundAuthor: '',
    };
  }
  return {
    soundUrl: sound.previews['preview-lq-mp3'],
    soundAuthor: sound.username,
  };
};

export const getLanguage = async query => {
  return 'en';
  // const url = 'http://apilayer.net/api/detect';
  // const params = {
  //   access_key: LANGUAGE_LAYER_API_KEY,
  //   query: query,
  // };
  // try {
  //   const { results } = await fetchApi(url, params);
  //   const firstResult = results[0];
  //   return firstResult;
  // } catch (error) {
  //   return 'en';
  // }
};

export { getCleverbotReply, getNews };
