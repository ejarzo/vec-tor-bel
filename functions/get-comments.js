const { YOUTUBE_API_KEY } = process.env;
const { fetchApi } = require('./utils');

const fetchYoutubeResults = videoId => {
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

exports.handler = async (event, context) => {
  console.log('get-videos called');
  const { videoId } = event.queryStringParameters || {};
  const results = await fetchYoutubeResults(videoId);
  try {
    console.log('success', results);
    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
