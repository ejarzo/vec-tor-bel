import { fetch } from './utils';

export const fetchYoutubeResults = query => {
  const url = 'get-videos';
  const params = {
    // key: YOUTUBE_API_KEY,
    q: query,
    part: 'snippet',
    name: 'test',
    type: 'video',
    maxResults: 15,
  };

  return fetch(url, params);
};
