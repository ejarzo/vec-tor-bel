import { getCurrentUser, getToken } from 'utils/user';

const ENDPOINT = '/.netlify/functions';
const browserFetch = window.fetch;

export const getEndpoint = path => `${ENDPOINT}/${path}`;

export const fetch = async (endpoint, options = {}) => {
  const currentUser = getCurrentUser();
  const fetchOptions = currentUser
    ? {
        headers: {
          ...options.headers,
          Authorization: `Bearer ${getToken(currentUser)}`,
        },
        ...options,
      }
    : options;

  return browserFetch(getEndpoint(endpoint), fetchOptions);
};
