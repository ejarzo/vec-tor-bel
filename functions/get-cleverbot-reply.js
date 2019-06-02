const { fetchApi, URLS } = require('./utils');
const { CLEVERBOT_API_KEY } = process.env;

const getCleverbotReply = (query, cs) => {
  const params = {
    key: CLEVERBOT_API_KEY,
    input: query,
    // cs: cs,
    cb_settings_emotion: 'yes',
    // cb_settings_tweak1: 50,
    // cb_settings_tweak2: 50,
  };

  return fetchApi(URLS.CLEVERBOT, params);
};

exports.handler = async (event, context) => {
  console.log('get-cleverbot-reply called');
  const { user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 403,
    };
  }

  try {
    const { query } = event.queryStringParameters || {};
    console.log(query);
    const response = await getCleverbotReply(query);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
