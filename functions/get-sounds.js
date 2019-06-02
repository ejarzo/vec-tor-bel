const { FREESOUND_API_KEY } = process.env;
const { fetchApi, URLS } = require('./utils');

const fetchFreesoundResults = (query, { min = 0, max = 200 } = {}) => {
  const rand = Math.random();
  const sort =
    rand < 0.2 ? 'rating_desc' : rand > 0.8 ? 'created_desc' : 'score';
  const params = {
    token: FREESOUND_API_KEY,
    page_size: 50,
    query: query,
    fields: 'name,previews,username',
    filter: `duration:[${min} TO ${max}]`,
    sort,
  };

  return fetchApi(URLS.FREESOUNDS, params);
};

exports.handler = async (event, context) => {
  console.log('get-sounds called');
  const { user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 403,
    };
  }

  try {
    const { query, min, max } = event.queryStringParameters || {};
    const { results } = await fetchFreesoundResults(query, { min, max });
    return {
      statusCode: 200,
      body: JSON.stringify({ sounds: results }),
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
