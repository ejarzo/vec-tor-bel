import { fetch } from './utils';

export const fetchYoutubeResults = async query => {
  const url = 'get-videos';
  const params = { q: query };
  const response = await fetch(url, params);
  const jsonResult = await response.json();
  return jsonResult;
};

export const fetchYoutubeComments = async videoId => {
  const url = 'get-comments';
  const params = { videoId };

  const response = await fetch(url, params);
  const jsonResult = await response.json();
  return jsonResult;
};

export const fetchFreesoundResults = async (
  query,
  { min = 0, max = 200 } = {}
) => {
  const url = 'get-sounds';
  const params = {
    query,
    min,
    max,
  };

  const response = await fetch(url, params);
  const jsonResult = await response.json();
  return jsonResult;
};

export const getCleverbotReply = async query => {
  const url = 'get-cleverbot-reply';
  const params = { query };
  const response = await fetch(url, params);
  const jsonResult = await response.json();
  return jsonResult;
};

export const getNews = async () => {
  const url = 'get-news';
  const response = await fetch(url);
  const jsonResult = await response.json();
  return jsonResult;
};
