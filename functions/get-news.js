const { fetchApi, URLS } = require('./utils');
const { NEWS_API_KEY } = process.env;

const getNews = () => {
  const params = {
    country: 'us',
    apiKey: NEWS_API_KEY,
  };

  return fetchApi(URLS.NEWS, params);
};

exports.handler = async (event, context) => {
  console.log('get-news called');
  const { user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 403,
    };
  }

  try {
    const results = await getNews();
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
