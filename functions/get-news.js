const { NEWS_API_KEY } = process.env;
const { fetchApi } = require('./utils');

const getNews = () => {
  const url = 'https://newsapi.org/v2/top-headlines/';
  const params = {
    country: 'us',
    apiKey: NEWS_API_KEY,
  };

  return fetchApi(url, params);
};

exports.handler = async (event, context) => {
  console.log('get-news called');
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
