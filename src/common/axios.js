import axios from 'axios';
import { getBaseURL } from './utils';
import { bigIntJSON } from './bigIntJSON';

const getQdrantBaseURL = () => {
  // Приоритет: переменная окружения VITE_QDRANT_URL
  if (import.meta.env.VITE_QDRANT_URL) {
    return import.meta.env.VITE_QDRANT_URL;
  }
  // Иначе используем стандартную логику
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:6333';
  }
  return getBaseURL();
};

export const axiosInstance = axios.create({
  baseURL: getQdrantBaseURL(),
  transformRequest: [
    function (data, headers) {
      if (data instanceof FormData) {
        return data;
      }
      headers['Content-Type'] = 'application/json';
      headers['x-inference-proxy'] = 'true';
      return bigIntJSON.stringify(data);
    },
  ],
  transformResponse: [
    function (data) {
      return bigIntJSON.parse(data);
    },
  ],
});

export function setupAxios(axios, { apiKey }) {
  axios.defaults.baseURL = getQdrantBaseURL();
  if (apiKey) {
    axios.defaults.headers.common['api-key'] = apiKey;
  }
  axios.defaults.transformRequest = [
    function (data, headers) {
      if (data instanceof FormData) {
        return data;
      }
      headers['Content-Type'] = 'application/json';
      headers['x-inference-proxy'] = 'true';
      return bigIntJSON.stringify(data);
    },
  ];
  axios.defaults.transformResponse = [
    function (data) {
      if (!data) {
        return data;
      }
      return bigIntJSON.parse(data);
    },
  ];
}
