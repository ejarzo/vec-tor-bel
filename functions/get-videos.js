const { YOUTUBE_API_KEY } = process.env;
const { fetchApi, URLS } = require('./utils');

const fetchYoutubeResults = query => {
  const params = {
    key: YOUTUBE_API_KEY,
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: 15,
  };

  return fetchApi(URLS.YOUTUBE_VIDEOS, params);
};

exports.handler = async (event, context) => {
  console.log('================= get-videos called =================');
  const { user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 403,
    };
  }

  try {
    const { query } = event.queryStringParameters || {};
    const youtubeResults = await fetchYoutubeResults(query);
    console.log('get-videos success');
    return {
      statusCode: 200,
      body: JSON.stringify(youtubeResults),
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
