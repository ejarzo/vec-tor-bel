const { fetchApi, URLS } = require('./utils');
const { YOUTUBE_API_KEY } = process.env;

const fetchYoutubeResults = videoId => {
  const params = {
    key: YOUTUBE_API_KEY,
    videoId,
    part: 'snippet',
    textFormat: 'plainText',
    order: 'relevance',
    maxResults: 5,
  };

  return fetchApi(URLS.YOUTUBE_COMMENTS, params);
};

exports.handler = async (event, context) => {
  console.log('get-videos called');
  const { user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 403,
    };
  }

  try {
    const { videoId } = event.queryStringParameters || {};
    const results = await fetchYoutubeResults(videoId);
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
